import express from "express";
const router = express.Router();
import User from "../models/User.js"; 

router.post("/clerk", async (req, res) => {
  const eventType = req.body.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = req.body.data;

    const email = email_addresses[0]?.email_address;

    try {
      await User.create({
        clerkId: id,
        email,
        firstName: first_name,
        lastName: last_name,
      });
      res.status(200).send("User created");
    } catch (err) {
      res.status(500).send("Error creating user");
    }
  } else {
    res.status(200).send("Unhandled event");
  }
});

module.exports = router;
