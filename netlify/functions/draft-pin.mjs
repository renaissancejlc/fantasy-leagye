import crypto from 'node:crypto';
import { appendSheetOpsRow, json, normalize, pinMatches, readBody, sheetOpsRows } from './_shared/notifications.mjs';

const acceptedNames = (team) => normalize(team) === 'kevin' ? ['kevin', 'angelo'] : [normalize(team)];

export default async (request) => {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method Not Allowed' }, 405);
  try {
    const key = process.env.SHEETOPS_VOTES_API_KEY;
    if (!key) return json({ ok: false, error: 'PIN service is not configured' }, 503);
    const body = await readBody(request);
    const team = String(body.team || '').trim();
    const action = String(body.action || 'status');
    if (!team) return json({ ok: false, error: 'Team is required' }, 400);

    const rows = await sheetOpsRows(18, 'Pins', key);
    const names = acceptedNames(team);
    const record = rows.find((row) => names.includes(normalize(row.voter)));

    if (action === 'status') return json({ ok: true, exists: Boolean(record) });
    if (action === 'verify') return json({ ok: true, valid: pinMatches(String(body.pin || ''), record) });
    if (action === 'create') {
      if (record) return json({ ok: false, error: 'A PIN already exists for this manager' }, 409);
      const pin = String(body.pin || '');
      if (pin.length < 4) return json({ ok: false, error: 'PIN must be at least 4 characters' }, 400);
      const salt = crypto.randomBytes(6).toString('base64url');
      const pinHash = crypto.createHash('sha256').update(`${salt}:${pin}`).digest('hex');
      await appendSheetOpsRow(18, 'Pins', { voter: team, salt, pinHash, updatedAt: new Date().toISOString() }, key);
      return json({ ok: true, created: true });
    }
    return json({ ok: false, error: 'Invalid PIN action' }, 400);
  } catch (error) {
    console.error('[draftPin]', error);
    return json({ ok: false, error: 'PIN service failed' }, 502);
  }
};

export const config = { path: '/api/draftPin' };
