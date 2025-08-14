import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

// Static config (no process.env). For production, consider moving back to env vars.
const CONFIG = {
  SLACK_WEBHOOK: "", // optional
  DISCORD_WEBHOOK: "https://discord.com/api/webhooks/1405602854244188182/ZI4aYoCLTTqPgY0qJP-x6bxB4L0cCeiLQeu0OsxtyUpQ-rFU9vxvi8_2VJyLxLvO_0Bn",
  RESEND_KEY: "",               // optional email API key
  NOTIFY_EMAILS: "",            // comma-separated list
  TWILIO_SID: "",               // optional SMS
  TWILIO_TOKEN: "",
  TWILIO_FROM: "",
  NOTIFY_SMS: "",               // comma-separated list of phone numbers
};

// helper: post to Slack/Discord if configured
async function postWebhook(url: string, payload: any) {
  if (!url) return;
  await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { pickNumber, round, team, pick, status, submittedAt } = req.body;

    // // ---- Slack (simple) ----
    // await postWebhook(CONFIG.SLACK_WEBHOOK, {
    //   text: `🏈 Round ${round}, Pick ${pickNumber}: *${team}* selects *${pick}* (${status}) – ${new Date(submittedAt).toLocaleString()}`
    // });

    // ---- Discord ----
    await postWebhook(CONFIG.DISCORD_WEBHOOK, {
      content: `🏈 **Round ${round}, Pick ${pickNumber}** — **${team}** selects **${pick}** (${status}).`
    });

    // // ---- Email (Resend) optional ----
    // if (CONFIG.RESEND_KEY) {
    //   const to = (CONFIG.NOTIFY_EMAILS || "").split(",").map(s => s.trim()).filter(Boolean);
    //   if (to.length) {
    //     await fetch("https://api.resend.com/emails", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${CONFIG.RESEND_KEY}` },
    //       body: JSON.stringify({
    //         from: "league-bot@yourdomain.com",
    //         to,
    //         subject: `Pick: ${team} → ${pick} (R${round} P${pickNumber})`,
    //         html: `<p><strong>${team}</strong> selected <strong>${pick}</strong> in Round ${round}, Pick ${pickNumber} (${status}).</p>`
    //       })
    //     });
    //   }
    // }

    res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ ok: false, error: e?.message || "notify failed" });
  }
}