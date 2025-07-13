// routes/webhook.js
import express from "express";
import { verifyClerkWebhook } from "../middlewares/verifyClerkWebhook.js";
import { handleClerkWebhook } from "../controllers/clerkWebhookController.js";

const router = express.Router();

router.post("/clerk", verifyClerkWebhook, handleClerkWebhook);

export default router;
