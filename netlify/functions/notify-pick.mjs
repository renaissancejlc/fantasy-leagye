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

const pinVoterNames = (team) => normalize(team) === 'kevin' ? ['kevin', 'angelo'] : [normalize(team)];
const DISCORD_USER_IDS = Object.freeze({
  kevin: '207223813623119872',
  angelo: '207223813623119872',
  dad: '1406393702686920787',
  utsav: '1537957407068651633',
  julio: '1538160983489519626',
  christian: '1538233842731581450',
  callie: '1538253600415809546',
  raphy: '1538256310603219155',
  daisy: '1287122323811471476',
  dustin: '1407796620157915218',
});

export default async (request) => {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method Not Allowed' }, 405);
  try {
    const body = await readBody(request);
    const webhook = process.env.DRAFT_DISCORD_WEBHOOK_URL;
    const draftKey = process.env.SHEETOPS_DRAFT_API_KEY;
    const votesKey = process.env.SHEETOPS_VOTES_API_KEY;
    if (!webhook || !draftKey || !votesKey) return json({ ok: false, error: 'Notification service is not configured' }, 503);

    if (body.test === true) {
      const publicTestExpiresAt = Date.parse('2026-08-15T09:00:00-07:00');
      if (!validTestRequest(request) && Date.now() >= publicTestExpiresAt) {
        return json({ ok: false, error: 'Public notification testing has expired' }, 410);
      }
      const resultRows = await sheetOpsRows(18, 'Results', votesKey);
      const day = new Date().toISOString().slice(0, 10);
      const notifiedKey = `draft-test-${day}`;
      if (resultRows.some((row) => row.notifiedKey === notifiedKey)) return json({ ok: true, test: true, duplicate: true });
      await postDiscord(webhook, '✅ **UI integration test** — Carr League draft notifications are connected.');
      await appendSheetOpsRow(18, 'Results', { notifiedKey, type: 'draft-test', notifiedAt: new Date().toISOString() }, votesKey);
      return json({ ok: true, test: true });
    }

    const pickNumber = Number(body.pickNumber);
    const round = Number(body.round);
    const team = String(body.team || '').trim();
    const pick = String(body.pick || '').trim();
    const status = String(body.status || 'PICKED').toUpperCase();
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
    const teamField = Object.keys(draftRows[0] || {}).find((key) => key.toLowerCase() === 'player')
      || Object.keys(draftRows[0] || {}).find((key) => key.toLowerCase() === 'draftl')
      || Object.keys(draftRows[0] || {}).find((key) => !/^round\s+\d+$/i.test(key));
    const draftRow = draftRows.find((row) => normalize(row?.[teamField]) === normalize(team));
    const teamIndex = draftRows.indexOf(draftRow);
    const expectedPickNumber = (round - 1) * draftRows.length + teamIndex + 1;
    const sheetPick = String(draftRow?.[`Round ${round}`] || '').trim();
    if (!draftRow || pickNumber !== expectedPickNumber || normalize(sheetPick) !== normalize(pick)) {
      return json({ ok: false, error: 'Pick does not match the draft sheet' }, 409);
    }

    if (status === 'PASSED') {
      const passLogged = logRows.some((row) => Number(row.pickNumber) === pickNumber && Number(row.round) === round &&
        normalize(row.team) === normalize(team) && normalize(row.pick) === 'pass' && normalize(row.status) === 'passed');
      if (normalize(pick) !== 'pass' || !passLogged) return json({ ok: false, error: 'Pass is not recorded in DraftLog' }, 403);
    } else {
      const acceptedPinNames = pinVoterNames(team);
      const pinRow = pinRows.find((row) => acceptedPinNames.includes(normalize(row.voter)));
      if (!pinMatches(body.pin, pinRow)) return json({ ok: false, error: 'Pick authentication failed' }, 403);
    }

    const notifiedKey = `draft-${round}-${pickNumber}-${normalize(team)}-${normalize(pick)}`;
    if (resultRows.some((row) => row.notifiedKey === notifiedKey)) return json({ ok: true, duplicate: true });
    const action = status === 'PASSED' ? `**${team}** passes.` : `**${team}** selects **${pick}**.`;
    const totalDraftPicks = draftRows.length * 3;
    const draftComplete = totalDraftPicks > 0 && expectedPickNumber === totalDraftPicks;
    const nextTeam = draftComplete ? '' : String(draftRows[(teamIndex + 1) % draftRows.length]?.[teamField] || '').trim();
    const nextUserId = DISCORD_USER_IDS[normalize(nextTeam)] || '';
    const followUp = draftComplete
      ? '\n🏁 **Draft complete!** All three rounds are finished.'
      : nextTeam
        ? `\n➡️ Up next: ${nextUserId ? `<@${nextUserId}> (**${nextTeam}**)` : `**${nextTeam}**`}`
        : '';
    await postDiscord(
      webhook,
      `🏈 **Round ${round}, Pick ${pickNumber}** — ${action}${followUp}`,
      nextUserId ? [nextUserId] : [],
    );
    await appendSheetOpsRow(18, 'Results', { notifiedKey, type: 'draft', notifiedAt: new Date().toISOString() }, votesKey);
    return json({ ok: true });
  } catch (error) {
    console.error('[notifyPick]', error);
    return json({ ok: false, error: 'Notification failed' }, 502);
  }
};

export const config = { path: '/api/notifyPick' };
