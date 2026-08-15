import crypto from 'node:crypto';

export const json = (body, status = 200) => Response.json(body, { status });

export const normalize = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^\w\s]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

export async function readBody(request) {
  const text = await request.text();
  if (text.length > 16 * 1024) throw new Error('Request body too large');
  return JSON.parse(text || '{}');
}

export async function sheetOpsRows(connectionId, tab, apiKey) {
  const response = await fetch(`https://api.sheetops.app/v1/connections/${connectionId}/rows?tab=${encodeURIComponent(tab)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) throw new Error(`SheetOps returned ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data : (data.rows || data.data || []);
}

export async function appendSheetOpsRow(connectionId, tab, row, apiKey) {
  const response = await fetch(`https://api.sheetops.app/v1/connections/${connectionId}/append`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ tab, row }),
  });
  if (!response.ok) throw new Error(`SheetOps append returned ${response.status}`);
}

export async function postDiscord(webhookUrl, content) {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'Fantasy League Bot', content }),
  });
  if (!response.ok) throw new Error(`Discord returned ${response.status}`);
}

export function pinMatches(pin, pinRow) {
  if (!pin || !pinRow) return false;
  const expected = String(pinRow.pinHash || pinRow.pinhash || pinRow.hash || '');
  const actual = crypto.createHash('sha256').update(`${pinRow.salt || ''}:${pin}`).digest('hex');
  return expected.length === actual.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

export const validTestRequest = (request) => Boolean(
  process.env.NOTIFICATION_TEST_KEY &&
  request.headers.get('x-notification-test-key') === process.env.NOTIFICATION_TEST_KEY
);
