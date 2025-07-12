import User from "../models/User.js";

export const handleClerkWebhook = async (req, res) => {
  const { data, type } = req.body;

  if (type === "user.created") {
    const { id, email_addresses, first_name, last_name } = data;

    try {
      await User.create({
        clerkId: id,
        email: email_addresses[0]?.email_address,
        name: `${first_name} ${last_name}`,
      });

      return res.status(200).send("User stored");
    } catch (err) {
      console.error("Error storing user:", err);
      return res.status(500).send("Error storing user");
    }
  }

  res.status(200).send("Ignored event");
};
