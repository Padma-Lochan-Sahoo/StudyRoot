import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true },
  email: String,
  firstName: String,
  lastName: String,
  publicMetadata: { type: mongoose.Schema.Types.Mixed },
});

export default mongoose.model("User", userSchema);
