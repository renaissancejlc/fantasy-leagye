import {
  appendSheetOpsRow,
  json,
  normalize,
  postDiscord,
  readBody,
  sheetOpsRows,
  validTestRequest,
} from './_shared/notifications.mjs';

export default async (request) => {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method Not Allowed' }, 405);
  try {
    const body = await readBody(request);
    const webhook = process.env.VOTES_DISCORD_WEBHOOK_URL;
    const votesKey = process.env.SHEETOPS_VOTES_API_KEY;
    if (!webhook || !votesKey) return json({ ok: false, error: 'Notification service is not configured' }, 503);

    if (body.test === true) {
      if (!validTestRequest(request)) return json({ ok: false, error: 'Forbidden' }, 403);
      await postDiscord(webhook, '✅ **Controlled integration test** — Carr League vote notifications are connected.');
      return json({ ok: true, test: true });
    }

    const motionId = String(body.motionId || '').trim();
    const seasonBucket = String(body.seasonBucket || '').trim();
    if (!motionId || !seasonBucket) return json({ ok: false, error: 'Invalid vote notification payload' }, 400);
    const [votes, results] = await Promise.all([
      sheetOpsRows(18, 'Votes', votesKey),
      sheetOpsRows(18, 'Results', votesKey),
    ]);
    const matching = votes.filter((vote) => String(vote.motionId) === motionId && String(vote.seasonBucket) === seasonBucket);
    const yes = matching.filter((vote) => normalize(vote.choice) === 'yes').length;
    const no = matching.filter((vote) => normalize(vote.choice) === 'no').length;
    const abstain = matching.length - yes - no;
    const openedAt = matching.reduce((earliest, vote) => {
      const value = Date.parse(vote.dateProposed || vote.timestamp || '');
      return Number.isFinite(value) ? Math.min(earliest, value) : earliest;
    }, Infinity);
    const closed = Number.isFinite(openedAt) && Date.now() >= openedAt + (3 * 24 * 60 * 60 * 1000);
    const outcome = yes >= 7 ? 'Passed' : no >= 7 ? 'Failed' : closed && yes > no ? 'Passed' : closed && no > yes ? 'Failed' : '';
    if (!outcome) return json({ ok: false, error: 'Vote is not decisively closed' }, 409);

    const notifiedKey = `${motionId}-${seasonBucket}-${outcome.toLowerCase()}`;
    if (results.some((row) => row.notifiedKey === notifiedKey)) return json({ ok: true, duplicate: true });
    const title = String(matching[0]?.motionTitle || motionId).trim();
    await postDiscord(webhook, `**League Vote Result**\nMotion: **${title}**\nSeason: ${seasonBucket}\nOutcome: **${outcome}**\nYes: ${yes} • No: ${no} • Abstain: ${abstain} • Total: ${matching.length}`);
    await appendSheetOpsRow(18, 'Results', { motionId, seasonBucket, notifiedKey, type: 'vote', notifiedAt: new Date().toISOString() }, votesKey);
    return json({ ok: true });
  } catch (error) {
    console.error('[notifyVote]', error);
    return json({ ok: false, error: 'Notification failed' }, 502);
  }
};

export const config = { path: '/api/notifyVote' };
