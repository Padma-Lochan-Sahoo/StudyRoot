// server.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import webhookRoutes from "./routes/webhook.js"

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI).then(() =>
  console.log("MongoDB connected")
);  
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
// Use Webhook Route
app.use("/webhooks", webhookRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
