// clerkWebhookController.js
import User from "../models/User.js";

export const handleClerkWebhook = async (req, res) => {
  const { data, type } = req.body;

  if (type === "user.created") {
    const { id, email_addresses, first_name, last_name, public_metadata } = data;

    try {
      await User.create({
        clerkId: id,
        email: email_addresses[0]?.email_address,
        firstName: first_name,
        lastName: last_name,
        publicMetadata: public_metadata || {},
      },
    { new: true });
      return res.status(200).send("User stored");
    } catch (err) {
      console.error("Error storing user:", err);
      return res.status(500).send("Error storing user");
    }
  }

  if (type === "user.updated") {
  const { id, email_addresses, first_name, last_name, public_metadata } = data;

  try {
    await User.findOneAndUpdate(
      { clerkId: id },
      {
        email: email_addresses[0]?.email_address,
        firstName: first_name,
        lastName: last_name,
        publicMetadata: public_metadata || {},
      },
      { new: true }
    );
    return res.status(200).send("User updated");
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).send("Error updating user");
  }
}


  res.status(200).send("Event ignored");
};
