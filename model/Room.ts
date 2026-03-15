import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  name: String,
  capacity: Number,
  isBooked: { type: Boolean, default: false },
});

export default mongoose.models.Room ||
  mongoose.model('Room', RoomSchema);
