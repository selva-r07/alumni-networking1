import mongoose, { Schema, models } from "mongoose";

const RegistrationSchema = new Schema({
  student_name: { type: String, required: true },
  department_no: { type: String, required: true },
  email:         { type: String, required: true },
  mobile:        { type: String, required: true },
  registeredAt:  { type: Date, default: Date.now },
});

const JobSchema = new Schema(
  {
    role:         { type: String, required: true },
    company_name: { type: String, required: true },
    salary:       { type: String, required: true },   // ← FIXED: was Number, now String (accepts "₹8–12 LPA")
    description:  { type: String, required: true },
    address:      { type: String, required: true },

    postedBy: {
      type: Schema.Types.ObjectId,
      ref:  "User",
      required: true,
    },

    registrations: [RegistrationSchema],
  },
  { timestamps: true }
);

export default models.Job || mongoose.model("Job", JobSchema);