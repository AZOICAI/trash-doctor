// Vercel serverless function — texts you when someone books
// Set these env vars in Vercel → Project → Settings → Environment Variables:
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_FROM_NUMBER   (your Twilio number, e.g. +15551234567)
//   BOOKING_NOTIFY_TO   (your phone, e.g. +14697421073)

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, address, plan } = req.body || {};

  if (!name || !phone || !address || !plan) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.BOOKING_NOTIFY_TO || "+14697421073";

  if (!accountSid || !authToken || !from) {
    console.error("Missing Twilio environment variables");
    return res.status(500).json({
      error: "Booking texts are not set up yet. Please call (469) 742-1073.",
    });
  }

  const body =
    `Trash Doctor booking request\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Address: ${address}\n` +
    `Plan: ${plan}`;

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const params = new URLSearchParams({ To: to, From: from, Body: body });

  try {
    const twilioRes = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await twilioRes.json();

    if (!twilioRes.ok) {
      console.error("Twilio error:", data);
      return res.status(502).json({
        error: "Could not send booking text. Please call (469) 742-1073.",
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Something went wrong. Please call (469) 742-1073.",
    });
  }
};
