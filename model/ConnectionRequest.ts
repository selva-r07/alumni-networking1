// models/ConnectionRequest.ts
import mongoose from 'mongoose';

const ConnectionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  alumni: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.models.ConnectionRequest ||
  mongoose.model('ConnectionRequest', ConnectionSchema);
