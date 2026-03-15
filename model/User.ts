import mongoose, { Schema, models } from "mongoose";

// Tracks each time a student views an alumni profile
const ProfileViewSchema = new Schema({
  viewedBy:  { type: Schema.Types.ObjectId, ref: "User", required: true }, // student's _id
  viewedAt:  { type: Date, default: Date.now },
});

const UserSchema = new Schema(
  {
    full_name:       { type: String, required: true },
    email:           { type: String, required: true, unique: true },
    password:        { type: String, required: true },
    role: {
      type:     String,
      enum:     ["student", "alumni", "admin"],
      required: true,
    },
    department:      { type: String, required: true },
    graduation_year: { type: Number, required: true },
    company:         { type: String },
    job_title:       { type: String },

    // ── NEW: profile view tracking (alumni only) ──
    // Each entry = one student visit. Deduped by student per day in the API.
    profileViews: [ProfileViewSchema],
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);