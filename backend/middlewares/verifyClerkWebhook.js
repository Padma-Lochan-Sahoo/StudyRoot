import crypto from "crypto";

export const verifyClerkWebhook = (req, res, next) => {
  const signature = req.headers["clerk-signature"];
  const rawBody = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac("sha256", process.env.CLERK_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(403).send("Invalid webhook signature");
  }

  next();
};
