import mongoose from 'mongoose';

const blobUrlSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    length: 4
  },
  blobUrl: String,
  expireTime: {type: Date, default: Date.now},
  createdAt: { type: Date, default: Date.now, }
});

const BlobUrl = mongoose.models.BlobUrl || mongoose.model('BlobUrl', blobUrlSchema);
export default BlobUrl;