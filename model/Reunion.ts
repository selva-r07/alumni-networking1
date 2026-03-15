import mongoose from 'mongoose';

const ReunionSchema = new mongoose.Schema({
  title: String,
  date: Date,
  location: String,
});

export default mongoose.models.Reunion ||
  mongoose.model('Reunion', ReunionSchema);
