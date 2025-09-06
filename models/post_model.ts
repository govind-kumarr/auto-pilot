import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
  url: { type: String, required: true },
  postContent: { type: String, required: true },
  scrapedBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: false,
  },
  analyzed: { type: Boolean, default: false },
});

const PostModel = mongoose.models?.posts || mongoose.model("posts", postSchema);

export default PostModel;
