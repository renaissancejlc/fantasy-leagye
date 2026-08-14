import {
  appendSheetOpsRow,
  json,
  normalize,
  pinMatches,
  postDiscord,
  readBody,
  sheetOpsRows,
  validTestRequest,
} from './_shared/notifications.mjs';

export default async (request) => {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method Not Allowed' }, 405);
  try {
    const body = await readBody(request);
    const webhook = process.env.DRAFT_DISCORD_WEBHOOK_URL;
    const draftKey = process.env.SHEETOPS_DRAFT_API_KEY;
    const votesKey = process.env.SHEETOPS_VOTES_API_KEY;
    if (!webhook || !draftKey || !votesKey) return json({ ok: false, error: 'Notification service is not configured' }, 503);

    if (body.test === true) {
      if (!validTestRequest(request)) {
        const team = String(body.team || '').trim();
        const [pinRows, resultRows] = await Promise.all([
          sheetOpsRows(18, 'Pins', votesKey),
          sheetOpsRows(18, 'Results', votesKey),
        ]);
        const pinRow = pinRows.find((row) => normalize(row.voter) === normalize(team));
        if (!team || !pinMatches(body.pin, pinRow)) return json({ ok: false, error: 'Valid member name and PIN required' }, 403);
        const day = new Date().toISOString().slice(0, 10);
        const notifiedKey = `draft-test-${day}`;
        if (resultRows.some((row) => row.notifiedKey === notifiedKey)) return json({ ok: true, test: true, duplicate: true });
        await postDiscord(webhook, `✅ **Controlled integration test** — Draft notifications verified by **${team}**.`);
        await appendSheetOpsRow(18, 'Results', { notifiedKey, type: 'draft-test', notifiedAt: new Date().toISOString() }, votesKey);
        return json({ ok: true, test: true });
      }
      await postDiscord(webhook, '✅ **Controlled integration test** — Carr League draft notifications are connected.');
      return json({ ok: true, test: true });
    }

    const pickNumber = Number(body.pickNumber);
    const round = Number(body.round);
    const team = String(body.team || '').trim();
    const pick = String(body.pick || '').trim();
    const status = String(body.status || 'PICKED').toUpperCase();
    const nextUp = String(body.nextUp || '').trim();
    if (!Number.isInteger(pickNumber) || pickNumber < 1 || !Number.isInteger(round) || round < 1 ||
        !team || !pick || !['PICKED', 'PASSED'].includes(status)) {
      return json({ ok: false, error: 'Invalid notification payload' }, 400);
    }

    const [draftRows, pinRows, logRows, resultRows] = await Promise.all([
      sheetOpsRows(17, 'Draft', draftKey),
      sheetOpsRows(18, 'Pins', votesKey),
      sheetOpsRows(17, 'DraftLog', draftKey),
      sheetOpsRows(18, 'Results', votesKey),
    ]);
    const draftRow = draftRows.find((row) => normalize(row.Player) === normalize(team));
    const sheetPick = String(draftRow?.[`Round ${round}`] || '').trim();
    if (!draftRow || normalize(sheetPick) !== normalize(pick)) {
      return json({ ok: false, error: 'Pick does not match the draft sheet' }, 409);
    }

    if (status === 'PASSED') {
      const passLogged = logRows.some((row) => Number(row.pickNumber) === pickNumber && Number(row.round) === round &&
        normalize(row.team) === normalize(team) && normalize(row.pick) === 'pass' && normalize(row.status) === 'passed');
      if (normalize(pick) !== 'pass' || !passLogged) return json({ ok: false, error: 'Pass is not recorded in DraftLog' }, 403);
    } else {
      const pinRow = pinRows.find((row) => normalize(row.voter) === normalize(team));
      if (!pinMatches(body.pin, pinRow)) return json({ ok: false, error: 'Pick authentication failed' }, 403);
    }

    const notifiedKey = `draft-${round}-${pickNumber}-${normalize(team)}-${normalize(pick)}`;
    if (resultRows.some((row) => row.notifiedKey === notifiedKey)) return json({ ok: true, duplicate: true });
    const action = status === 'PASSED' ? `**${team}** passes.` : `**${team}** selects **${pick}**.`;
    await postDiscord(webhook, `🏈 **Round ${round}, Pick ${pickNumber}** — ${action}${nextUp ? `\n➡️ Up next: **${nextUp}**` : ''}`);
    await appendSheetOpsRow(18, 'Results', { notifiedKey, type: 'draft', notifiedAt: new Date().toISOString() }, votesKey);
    return json({ ok: true });
  } catch (error) {
    console.error('[notifyPick]', error);
    return json({ ok: false, error: 'Notification failed' }, 502);
  }
};

export const config = { path: '/api/notifyPick' };
