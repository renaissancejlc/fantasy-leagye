import {
  appendSheetOpsRow,
  normalize,
  postDiscord,
  sheetOpsRows,
} from './_shared/notifications.mjs';

const DRAFT_CONNECTION_ID = 17;
const VOTES_CONNECTION_ID = 18;
const ROUNDS = 3;
const PICK_WINDOW_MINUTES = 12 * 60;
const ACTIVE_TIME_ZONE = 'America/Los_Angeles';
const ACTIVE_START_HOUR = 8;
const ACTIVE_END_HOUR = 23;
const DRAFT_START = new Date('2026-08-15T09:30:00-07:00');
const TEAM_ORDER = ['River', 'Julio', 'Callie', 'Kevin', 'Dustin', 'Raphy', 'Daisy', 'Tariq', 'Dad', 'Christian', 'Utsav', 'Simon'];
const DISCORD_USER_IDS = Object.freeze({
  kevin: '207223813623119872', angelo: '207223813623119872', dad: '1406393702686920787',
  utsav: '1537957407068651633', julio: '1538160983489519626', christian: '1538233842731581450',
  callie: '1538253600415809546', raphy: '1538256310603219155', daisy: '1287122323811471476',
  dustin: '1407796620157915218',
});

const getTeamField = (rows) => {
  const keys = Object.keys(rows[0] || {});
  return keys.find((key) => normalize(key) === 'player')
    || keys.find((key) => normalize(key) === 'draftl')
    || keys.find((key) => !/^round\s+\d+$/i.test(key));
};

const getTimeZoneParts = (date) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: ACTIVE_TIME_ZONE,
    hour12: false,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  return formatter.formatToParts(date).reduce((parts, item) => {
    if (item.type === 'year') parts.year = Number(item.value);
    if (item.type === 'month') parts.month = Number(item.value);
    if (item.type === 'day') parts.day = Number(item.value);
    if (item.type === 'hour') parts.hour = Number(item.value);
    if (item.type === 'minute') parts.minute = Number(item.value);
    if (item.type === 'second') parts.second = Number(item.value);
    return parts;
  }, {});
};

const localPartsToDate = (parts) => {
  const target = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour || 0, parts.minute || 0, parts.second || 0);
  let guess = target;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const shown = getTimeZoneParts(new Date(guess));
    const shownAsUtc = Date.UTC(shown.year, shown.month - 1, shown.day, shown.hour || 0, shown.minute || 0, shown.second || 0);
    const correction = target - shownAsUtc;
    guess += correction;
    if (correction === 0) break;
  }
  return new Date(guess);
};

export const computeActiveDeadline = (startDate, minutes = PICK_WINDOW_MINUTES) => {
  let cursor = new Date(startDate);
  let remainingMs = minutes * 60_000;
  for (let guard = 0; remainingMs > 0 && guard < 1000; guard += 1) {
    const parts = getTimeZoneParts(cursor);
    const start = localPartsToDate({ ...parts, hour: ACTIVE_START_HOUR, minute: 0, second: 0 });
    const end = localPartsToDate({ ...parts, hour: ACTIVE_END_HOUR, minute: 0, second: 0 });
    if (cursor < start) {
      cursor = start;
      continue;
    }
    if (cursor >= end) {
      cursor = localPartsToDate({ ...parts, day: parts.day + 1, hour: ACTIVE_START_HOUR, minute: 0, second: 0 });
      continue;
    }
    const availableMs = end.getTime() - cursor.getTime();
    if (remainingMs <= availableMs) return new Date(cursor.getTime() + remainingMs);
    remainingMs -= availableMs;
    cursor = localPartsToDate({ ...parts, day: parts.day + 1, hour: ACTIVE_START_HOUR, minute: 0, second: 0 });
  }
  return cursor;
};

const getBoardState = (rows, teamField) => {
  const orderedRows = TEAM_ORDER.map((team) => rows.find((row) => normalize(row?.[teamField]) === normalize(team)));
  if (orderedRows.some((row) => !row)) return { valid: false, reason: 'Draft team list is incomplete' };
  const cells = [];
  for (let round = 1; round <= ROUNDS; round += 1) {
    for (const row of orderedRows) cells.push(String(row[`Round ${round}`] || '').trim());
  }
  const firstEmpty = cells.findIndex((cell) => !cell || cell === '—');
  const filled = firstEmpty === -1 ? cells.length : firstEmpty;
  if (firstEmpty !== -1 && cells.slice(firstEmpty + 1).some((cell) => cell && cell !== '—')) {
    return { valid: false, reason: 'Draft board contains a filled cell after an empty cell' };
  }
  if (filled >= cells.length) return { valid: true, complete: true, filled };
  const pickNumber = filled + 1;
  const round = Math.ceil(pickNumber / TEAM_ORDER.length);
  const teamIndex = (pickNumber - 1) % TEAM_ORDER.length;
  return { valid: true, complete: false, filled, pickNumber, round, teamIndex, team: TEAM_ORDER[teamIndex] };
};

const getDraftCell = (rows, teamField, pickNumber) => {
  const teamIndex = (pickNumber - 1) % TEAM_ORDER.length;
  const round = Math.ceil(pickNumber / TEAM_ORDER.length);
  const row = rows.find((candidate) => normalize(candidate?.[teamField]) === normalize(TEAM_ORDER[teamIndex]));
  return String(row?.[`Round ${round}`] || '').trim();
};

const patchEmptyDraftCell = async (apiKey, teamField, team, round) => {
  const response = await fetch(`https://api.sheetops.app/v1/connections/${DRAFT_CONNECTION_ID}/rows`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tab: 'Draft',
      match: { [teamField]: team, [`Round ${round}`]: '' },
      updates: { [`Round ${round}`]: 'PASS' },
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.row && normalize(data.row[`Round ${round}`]) === 'pass' ? data.row : null;
};

const announcePass = async ({ webhook, votesKey, resultRows, pickNumber, round, team }) => {
  const notifiedKey = `draft-auto-pass-${pickNumber}`;
  if (resultRows.some((row) => row.notifiedKey === notifiedKey)) return;
  const draftComplete = pickNumber >= TEAM_ORDER.length * ROUNDS;
  const nextTeam = draftComplete ? '' : TEAM_ORDER[pickNumber % TEAM_ORDER.length];
  const nextUserId = DISCORD_USER_IDS[normalize(nextTeam)] || '';
  const followUp = draftComplete
    ? '\n🏁 **Draft complete!** All three rounds are finished.'
    : `\n➡️ Up next: ${nextUserId ? `<@${nextUserId}> (**${nextTeam}**)` : `**${nextTeam}**`}`;
  await postDiscord(
    webhook,
    `🏈 **Round ${round}, Pick ${pickNumber}** — **${team}** passes.${followUp}`,
    nextUserId ? [nextUserId] : [],
  );
  await appendSheetOpsRow(VOTES_CONNECTION_ID, 'Results', {
    notifiedKey,
    type: 'draft-auto-pass',
    notifiedAt: new Date().toISOString(),
  }, votesKey);
  resultRows.push({ notifiedKey });
};

export default async () => {
  const draftKey = process.env.SHEETOPS_DRAFT_API_KEY;
  const votesKey = process.env.SHEETOPS_VOTES_API_KEY;
  const webhook = process.env.DRAFT_DISCORD_WEBHOOK_URL;
  if (!draftKey || !votesKey || !webhook) return new Response('Missing required environment variables', { status: 503 });

  try {
    const [rows, logs, resultRows] = await Promise.all([
      sheetOpsRows(DRAFT_CONNECTION_ID, 'Draft', draftKey),
      sheetOpsRows(DRAFT_CONNECTION_ID, 'DraftLog', draftKey),
      sheetOpsRows(VOTES_CONNECTION_ID, 'Results', votesKey),
    ]);

    // Retry Discord for an automatic pass that was written successfully during
    // a prior run but whose notification failed afterward.
    for (const log of logs.filter((row) => normalize(row.source) === 'auto-pass')) {
      await announcePass({
        webhook, votesKey, resultRows,
        pickNumber: Number(log.pickNumber), round: Number(log.round), team: String(log.team || ''),
      });
    }

    const teamField = getTeamField(rows);
    if (!teamField) return new Response('Draft team column was not found', { status: 409 });
    const state = getBoardState(rows, teamField);
    if (!state.valid) return new Response(state.reason, { status: 409 });

    // Recover a run that updated the Draft cell but stopped before it could
    // append DraftLog or notify Discord. The intent is written before PATCH,
    // so only passes initiated by this worker are eligible for recovery.
    for (const intent of resultRows.filter((row) => normalize(row.type) === 'draft-auto-pass-intent')) {
      const pickNumber = Number(intent.pickNumber);
      if (!pickNumber || logs.some((row) => Number(row.pickNumber) === pickNumber)) continue;
      if (normalize(getDraftCell(rows, teamField, pickNumber)) !== 'pass') continue;
      const round = Number(intent.round) || Math.ceil(pickNumber / TEAM_ORDER.length);
      const team = String(intent.team || TEAM_ORDER[(pickNumber - 1) % TEAM_ORDER.length]);
      await appendSheetOpsRow(DRAFT_CONNECTION_ID, 'DraftLog', {
        pickNumber, round, team, pick: 'PASS', status: 'PASSED',
        submittedAt: intent.intendedAt || new Date().toISOString(),
        windowHours: PICK_WINDOW_MINUTES / 60,
        source: 'AUTO-PASS',
      }, draftKey);
      logs.push({ pickNumber, round, team, source: 'AUTO-PASS' });
      await announcePass({ webhook, votesKey, resultRows, pickNumber, round, team });
      return new Response(`Recovered automatic pass for ${team} at pick ${pickNumber}`);
    }
    if (state.complete) return new Response('Draft complete');

    const previousPick = state.pickNumber - 1;
    let clockStart = DRAFT_START;
    if (previousPick > 0) {
      const previousLogs = logs
        .filter((row) => Number(row.pickNumber) === previousPick)
        .map((row) => new Date(row.submittedAt || row.timestamp))
        .filter((date) => !Number.isNaN(date.getTime()))
        .sort((a, b) => b - a);
      if (!previousLogs.length) return new Response(`Missing DraftLog row for pick ${previousPick}`, { status: 409 });
      clockStart = previousLogs[0];
    }

    const deadline = computeActiveDeadline(clockStart);
    if (Date.now() < deadline.getTime()) return new Response(`Pick ${state.pickNumber} is not expired`);

    // Re-read immediately before mutation and require the same empty pick. The
    // empty-cell match is an optimistic lock against picks submitted concurrently.
    const latestRows = await sheetOpsRows(DRAFT_CONNECTION_ID, 'Draft', draftKey);
    const latestTeamField = getTeamField(latestRows);
    const latestState = getBoardState(latestRows, latestTeamField);
    if (!latestState.valid || latestState.complete || latestState.pickNumber !== state.pickNumber || latestState.team !== state.team) {
      return new Response('Draft advanced before pass; no mutation performed');
    }

    const intendedAt = new Date().toISOString();
    await appendSheetOpsRow(VOTES_CONNECTION_ID, 'Results', {
      operationKey: `draft-auto-pass-intent-${state.pickNumber}`,
      type: 'draft-auto-pass-intent',
      pickNumber: state.pickNumber,
      round: state.round,
      team: state.team,
      intendedAt,
    }, votesKey);

    const updatedRow = await patchEmptyDraftCell(draftKey, latestTeamField, state.team, state.round);
    if (!updatedRow) return new Response('Draft cell was no longer empty; no mutation performed');

    const submittedAt = new Date().toISOString();
    await appendSheetOpsRow(DRAFT_CONNECTION_ID, 'DraftLog', {
      pickNumber: state.pickNumber,
      round: state.round,
      team: state.team,
      pick: 'PASS',
      status: 'PASSED',
      submittedAt,
      windowHours: PICK_WINDOW_MINUTES / 60,
      source: 'AUTO-PASS',
    }, draftKey);
    await announcePass({ webhook, votesKey, resultRows, ...state });
    return new Response(`Passed ${state.team} at pick ${state.pickNumber}`);
  } catch (error) {
    console.error('[autoPassDraft]', error);
    return new Response('Automatic pass failed', { status: 500 });
  }
};

export const config = { schedule: '*/5 * * * *' };
