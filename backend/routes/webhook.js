import express from "express";
import { handleClerkWebhook } from "../controllers/clerkWebhookController.js";
import { verifyClerkWebhook } from "../middlewares/verifyClerkWebhook.js";

const router = express.Router();

router.post("/clerk", verifyClerkWebhook, handleClerkWebhook);

export default router;
