// clerkWebhookController.js
import User from "../models/User.js";

export const handleClerkWebhook = async (req, res) => {
  console.log("📦 Incoming Clerk Webhook Body:", JSON.stringify(req.body, null, 2));
  const { data, type } = req.body;

  if (!data || !type) {
    console.error("❌ Invalid Clerk event payload");
    return res.status(400).send("Invalid event payload");
  }

  console.log(`📣 Handling Clerk event: ${type}`);

  if (type === "user.created") {
    const { id, email_addresses, first_name, last_name, public_metadata } = data;

    if (!id) {
      console.error("❌ user.created event missing user id");
      return res.status(400).send("Missing user id");
    }

    try {
      await User.create({
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "",
        firstName: first_name || "",
        lastName: last_name || "",
        publicMetadata: public_metadata || {},
      });

      console.log(`✅ User created: ${id}`);
      return res.status(200).send("User stored");
    } catch (err) {
      console.error("❌ Error storing user:", err);
      return res.status(500).send("Error storing user");
    }
  }

  if (type === "user.updated") {
    const { id, email_addresses, first_name, last_name, public_metadata } = data;

    if (!id) {
      console.error("❌ user.updated event missing user id");
      return res.status(400).send("Missing user id");
    }

    try {
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email_addresses?.[0]?.email_address || "",
          firstName: first_name || "",
          lastName: last_name || "",
          publicMetadata: public_metadata || {},
        },
        { new: true }
      );

      console.log(`✅ User updated: ${id}`);
      return res.status(200).send("User updated");
    } catch (err) {
      console.error("❌ Error updating user:", err);
      return res.status(500).send("Error updating user");
    }
  }

  if (type === "user.deleted") {
  const { id } = data;

  if (!id) {
    console.error("Webhook user.deleted missing id");
    return res.status(400).send("Missing user id");
  }

  try {
    const deletedUser = await User.findOneAndDelete({ clerkId: id });
    if (deletedUser) {
      console.log(`✅ User deleted: ${id}`);
    } else {
      console.log(`⚠️ User not found for deletion: ${id}`);
    }
    return res.status(200).send("User deleted");
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).send("Error deleting user");
  }
}


  console.log("ℹ️ Event ignored:", type);
  res.status(200).send("Event ignored");
};
