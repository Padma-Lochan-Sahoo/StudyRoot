// verifyClerkWebhook.js
import { Webhook } from "svix";

// export const verifyClerkWebhook = async (req, res, next) => {
//   const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//   let evt;

//   try {
//     evt = wh.verify(req.rawBody, req.headers);
//   } catch (err) {
//     console.error(err);
//     return res.status(400).send("Invalid webhook signature");
//   }

//   req.body = evt;
//   next();
// };

export const verifyClerkWebhook = (req, res, next) => {
  console.log("Skipping signature check for local test");
  next();
};

