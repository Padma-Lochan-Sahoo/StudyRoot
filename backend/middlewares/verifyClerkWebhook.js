// middlewares/verifyClerkWebhook.js
import { Webhook } from "svix";

export const verifyClerkWebhook = (req, res, next) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("❌ Missing CLERK_WEBHOOK_SECRET");
    return res.status(500).send("Server error: Missing webhook secret");
  }

  const wh = new Webhook(webhookSecret);

  try {
    const evt = wh.verify(req.rawBody, req.headers);
    req.body = evt; // replace raw body with parsed verified one
    next();
  } catch (err) {
    console.error("❌ Signature verification failed:", err.message);
    return res.status(400).send("Invalid webhook signature");
  }
};
