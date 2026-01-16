import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    photo: {
      type: String,
      required: true
    },

    photoPublicId: {
      type: String,
      required: true
    },

    speciality: {
      type: String,
      required: true
    },

    qualification: {
      type: String,
      required: true
    },

    designation: {
      type: String,
      required: true
    },

    experience: {
      type: Number,
      required: true
    },

    hospital: {
      name: { type: String, required: true },
      city: { type: String, required: true },
      accreditation: [{ type: String }]
    },

    summary: {
      type: String,
      required: true
    },

    about: {
      type: String,
      required: true
    },

    expertise: [
      {
        type: String,
        required: true
      }
    ],

    procedures: [
      {
        type: String,
        required: true
      }
    ],

    whyChoose: [
      {
        type: String,
        required: true
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
