import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
  role: { type: String, required: true },
  hr_email: { type: String, required: true },
  subject: { type: String },
  body: { type: String },
  scrapedBy: { ref: "users", type: Schema.Types.ObjectId },
  originalPost: { ref: "posts", type: Schema.Types.ObjectId },
});

const RoleModel = mongoose.models?.roles || mongoose.model("roles", roleSchema);

export default RoleModel;
