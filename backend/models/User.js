import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true },
  email: String,
  firstName: String,
  lastName: String,
});

export default mongoose.model("User", userSchema);
