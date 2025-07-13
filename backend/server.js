import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import webhookRoutes from "./routes/webhook.js"

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI).then(() =>
  console.log("MongoDB connected")
);

// Use Webhook Route
app.use("/webhooks", webhookRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
