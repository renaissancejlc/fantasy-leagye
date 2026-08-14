// Minimal SMS API server without external deps
// Run: node server/index.js
// Node 18+ required (global fetch). Env: TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- tiny .env loader so we don't need dotenv ---
(function loadEnv() {
  try {
    const candidates = [path.resolve(process.cwd(), '.env.local'), path.resolve(process.cwd(), '.env')];
    for (const p of candidates) {
      if (!fs.existsSync(p)) continue;
      const text = fs.readFileSync(p, 'utf8');
      for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const eq = line.indexOf('=');
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        let val = line.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\'') && val.endsWith('\''))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
      }
      break; // stop at first file found
    }
  } catch {}
})();

// CORS helpers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), ...CORS_HEADERS });
  res.end(body);
}

const notifiedDraftPicks = new Set();
const notificationAttempts = new Map();

function notificationRateLimited(req) {
  const key = req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const recent = (notificationAttempts.get(key) || []).filter((time) => now - time < 60_000);
  recent.push(now);
  notificationAttempts.set(key, recent);
  return recent.length > 5;
}

async function readJsonBody(req) {
  let buf = '';
  for await (const chunk of req) {
    buf += chunk;
    if (buf.length > 16 * 1024) throw new Error('Request body too large');
  }
  return JSON.parse(buf || '{}');
}

async function sheetOpsRows(connectionId, tab, apiKey) {
  const response = await fetch(`https://api.sheetops.app/v1/connections/${connectionId}/rows?tab=${encodeURIComponent(tab)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) throw new Error(`SheetOps returned ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data : (data.rows || data.data || []);
}

const normalize = (value) => String(value || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();

async function authenticateDraftPick(body) {
  const draftKey = process.env.SHEETOPS_DRAFT_API_KEY;
  const votesKey = process.env.SHEETOPS_VOTES_API_KEY;
  if (!draftKey || !votesKey || !body.pin) return false;

  const [draftRows, pinRows] = await Promise.all([
    sheetOpsRows(17, 'Draft', draftKey),
    sheetOpsRows(18, 'Pins', votesKey),
  ]);
  const draftRow = draftRows.find((row) => normalize(row.Player) === normalize(body.team));
  const pinRow = pinRows.find((row) => normalize(row.voter) === normalize(body.team));
  if (!draftRow || !pinRow) return false;

  const expectedHash = pinRow.pinHash || pinRow.pinhash || pinRow.hash;
  const computedHash = crypto.createHash('sha256').update(`${pinRow.salt || ''}:${body.pin}`).digest('hex');
  const hashesMatch = expectedHash && expectedHash.length === computedHash.length &&
    crypto.timingSafeEqual(Buffer.from(expectedHash), Buffer.from(computedHash));
  const sheetPick = String(draftRow[`Round ${body.round}`] || '').trim();
  return hashesMatch && normalize(sheetPick) === normalize(body.pick);
}

async function postDiscord(webhookUrl, content) {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'Fantasy League Bot', content }),
  });
  if (!response.ok) throw new Error(`Discord returned ${response.status}`);
}

async function handleNotifyPick(req, res) {
  try {
    if (notificationRateLimited(req)) return sendJson(res, 429, { ok: false, error: 'Too many requests' });
    const body = await readJsonBody(req);
    const webhookUrl = process.env.DRAFT_DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return sendJson(res, 503, { ok: false, error: 'Discord is not configured' });

    if (body.test === true) {
      if (!process.env.NOTIFICATION_TEST_KEY || req.headers['x-notification-test-key'] !== process.env.NOTIFICATION_TEST_KEY) {
        return sendJson(res, 403, { ok: false, error: 'Forbidden' });
      }
      await postDiscord(webhookUrl, '✅ **Controlled integration test** — Carr League draft notifications are connected.');
      return sendJson(res, 200, { ok: true, test: true });
    }

    const pickNumber = Number(body.pickNumber);
    const round = Number(body.round);
    const team = String(body.team || '').trim();
    const pick = String(body.pick || '').trim();
    const nextUp = String(body.nextUp || '').trim();
    if (!Number.isInteger(pickNumber) || pickNumber < 1 || !Number.isInteger(round) || round < 1 || !team || !pick) {
      return sendJson(res, 400, { ok: false, error: 'Invalid notification payload' });
    }
    if (!(await authenticateDraftPick({ ...body, round, team, pick }))) {
      return sendJson(res, 403, { ok: false, error: 'Pick authentication failed' });
    }

    const notificationId = `${round}:${pickNumber}:${normalize(team)}:${normalize(pick)}`;
    if (notifiedDraftPicks.has(notificationId)) return sendJson(res, 200, { ok: true, duplicate: true });
    const content = `🏈 **Round ${round}, Pick ${pickNumber}** — **${team}** selects **${pick}**.${nextUp ? `\n➡️ Up next: **${nextUp}**` : ''}`;
    await postDiscord(webhookUrl, content);
    notifiedDraftPicks.add(notificationId);
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error('[notifyPick] error', error?.message || error);
    return sendJson(res, 502, { ok: false, error: 'Discord notification failed' });
  }
}

// Normalize common US-formatted inputs to E.164. Returns null if invalid.
function normalizeE164(raw) {
  if (!raw) return null;
  const s = String(raw);
  const digits = s.replace(/[^\d]/g, '');
  if (!digits) return null;
  if (digits.length === 10) return `+1${digits}`; // assume US
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (s.trim().startsWith('+') && digits.length >= 11) return `+${digits}`;
  return null;
}

async function handleNotifyTurn(req, res) {
  try {
    // read JSON body
    let buf = '';
    for await (const chunk of req) buf += chunk;
    let body;
    try { body = JSON.parse(buf || '{}'); } catch { return sendJson(res, 400, { ok: false, error: 'Invalid JSON' }); }

    const to = body && body.to;
    const message = body && body.message;
    const phone = normalizeE164(to);
    if (!phone || !message || typeof message !== 'string' || message.trim().length === 0) {
      return sendJson(res, 400, { ok: false, error: 'Missing or invalid `to`/`message`' });
    }

    const sid = process.env.TWILIO_SID;
    const token = process.env.TWILIO_TOKEN;
    const from = process.env.TWILIO_FROM; // e.g., +17756184800

    if (!sid || !token || !from) {
      console.log('[notifyTurn] DRY RUN (no Twilio env).', { to: phone, message });
      return sendJson(res, 200, { ok: true, dryRun: true });
    }

    const auth = Buffer.from(`${sid}:${token}`).toString('base64');
    const form = new URLSearchParams({ To: phone, From: from, Body: message });

    const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error('[notifyTurn] Twilio error', { status: resp.status, data });
      return sendJson(res, 502, { ok: false, error: 'Twilio API error' });
    }
    return sendJson(res, 200, { ok: true, sid: data && data.sid });
  } catch (e) {
    console.error('[notifyTurn] server error', e);
    return sendJson(res, 500, { ok: false, error: 'Internal Server Error' });
  }
}

async function handleSmsStatus(req, res) {
  try {
    // parse sid from query string
    const u = new URL(req.url, 'http://localhost');
    const msgSid = u.searchParams.get('sid');
    if (!msgSid) return sendJson(res, 400, { ok: false, error: 'Missing sid' });

    const sid = process.env.TWILIO_SID;
    const token = process.env.TWILIO_TOKEN;
    const from = process.env.TWILIO_FROM;

    if (!sid || !token || !from) {
      return sendJson(res, 200, { ok: true, dryRun: true, status: 'unknown' });
    }

    const auth = Buffer.from(`${sid}:${token}`).toString('base64');
    const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages/${encodeURIComponent(msgSid)}.json`, {
      method: 'GET',
      headers: { Authorization: `Basic ${auth}` },
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error('[smsStatus] Twilio error', { status: resp.status, data });
      return sendJson(res, 502, { ok: false, error: 'Twilio API error', twilio: data });
    }

    const { status, error_code, error_message, to, from: twFrom, date_updated } = data;
    return sendJson(res, 200, { ok: true, status, error_code, error_message, to, from: twFrom, date_updated, raw: data });
  } catch (e) {
    console.error('[smsStatus] server error', e);
    return sendJson(res, 500, { ok: false, error: 'Internal Server Error' });
  }
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }
  const { url, method } = req;
  if (method === 'POST' && url === '/api/notifyTurn') {
    return handleNotifyTurn(req, res);
  }
  if (method === 'POST' && url === '/api/notifyPick') {
    return handleNotifyPick(req, res);
  }
  if (method === 'GET' && url.startsWith('/api/smsStatus')) {
    return handleSmsStatus(req, res);
  }
  // Not found
  res.writeHead(404, { 'Content-Type': 'text/plain', ...CORS_HEADERS });
  res.end('Not Found');
});

const PORT = process.env.SMS_PORT || 5174;
server.listen(PORT, () => {
  console.log(`[sms] listening on http://localhost:${PORT}`);
});
