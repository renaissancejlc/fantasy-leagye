

import type { NextApiRequest, NextApiResponse } from 'next';

// Response shape
type Resp = {
  ok: boolean;
  dryRun?: boolean;
  sid?: string;
  error?: string;
};

// Normalize common US-formatted inputs to E.164. Returns null if invalid.
function normalizeE164(raw: unknown): string | null {
  if (!raw) return null;
  const s = String(raw);
  const digits = s.replace(/[^\d]/g, '');
  if (!digits) return null;
  // 10 digits => assume US and prepend +1
  if (digits.length === 10) return `+1${digits}`;
  // 11 digits starting with 1 => US with country code
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  // If original had + and at least 11 digits, keep + and digits
  if (s.trim().startsWith('+') && digits.length >= 11) return `+${digits}`;
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Resp>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { to, message } = (req.body || {}) as { to?: string; message?: string };
    const phone = normalizeE164(to);
    if (!phone || !message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ ok: false, error: 'Missing or invalid `to`/`message`' });
    }

    // Short-circuit if Twilio env vars are not configured — succeed in DRY RUN
    const sid = process.env.TWILIO_SID;
    const token = process.env.TWILIO_TOKEN;
    const from = process.env.TWILIO_FROM; // e.g. +15550001111

    if (!sid || !token || !from) {
      console.log('[notifyTurn] DRY RUN (no Twilio env).', { to: phone, message });
      return res.status(200).json({ ok: true, dryRun: true });
    }

    // Send via Twilio REST API over HTTPS (no SDK dependency)
    const auth = Buffer.from(`${sid}:${token}`).toString('base64');
    const form = new URLSearchParams({
      To: phone,
      From: from,
      Body: message,
    });

    const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });

    const data: any = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      // Surface Twilio error info but don’t crash the server
      console.error('[notifyTurn] Twilio error', { status: resp.status, data });
      return res.status(502).json({ ok: false, error: 'Twilio API error' });
    }

    return res.status(200).json({ ok: true, sid: data?.sid });
  } catch (error) {
    console.error('[notifyTurn] error', error);
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
}

// Optional: limit the body size a bit for safety (uncomment if you want tighter limits)
// export const config = { api: { bodyParser: { sizeLimit: '10kb' } } };