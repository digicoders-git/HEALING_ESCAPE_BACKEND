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
    },

    designation: {
      type: String,
    },

    experience: {
      type: Number,
    },

    hospital: {
      name: { type: String },
      city: { type: String },
      accreditation: [{ type: String }]
    },

    summary: {
      type: String,
    },

    about: {
      type: String,
    },

    expertise: [
      {
        type: String,
      }
    ],

    procedures: [
      {
        type: String,
      }
    ],

    whyChoose: [
      {
        type: String,
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
