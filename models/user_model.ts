import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  google_refresh_token: { type: String, required: true, unique: true },
});

const UserModel = mongoose.models?.users || mongoose.model("users", userSchema);

export default UserModel;
