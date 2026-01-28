import mongoose from "mongoose";

const specialitySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true
    },

    imagePublicId: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    description: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Speciality = mongoose.model("Speciality", specialitySchema);

export default Speciality;
