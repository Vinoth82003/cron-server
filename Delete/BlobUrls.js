import mongoose from "mongoose";

const blobUrlSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    length: 4,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expireTime: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    },
  },
});

const BlobUrl =
  mongoose.models.BlobUrl || mongoose.model("BlobUrl", blobUrlSchema);
export default BlobUrl;
