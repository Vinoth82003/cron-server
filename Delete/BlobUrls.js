const mongoose = require("mongoose");

const blobUrlSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, length: 4 },
  createdAt: { type: Date, default: Date.now },
  expireTime: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 5 * 60 * 1000);
    },
  },
});

const BlobUrl = mongoose.model("BlobUrl", blobUrlSchema);

module.exports = BlobUrl;
