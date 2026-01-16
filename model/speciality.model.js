import mongoose from "mongoose";

const specialitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    image: {
      type: String,
      required: true
    },

    imagePublicId: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    whatIs: {
      type: String,
      required: true
    },

    whenRecommended: [
      {
        type: String,
        required: true
      }
    ],

    procedure: {
      type: String,
      required: true
    },

    recovery: {
      type: String,
      required: true
    },

    costRange: {
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
