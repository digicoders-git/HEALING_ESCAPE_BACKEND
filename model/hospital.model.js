import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    city: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      required: true
    },

    imagePublicId: {
      type: String,
      required: true
    },

    accreditations: [
      {
        type: String,
        required: true
      }
    ],

    specialities: [
      {
        type: String,
        required: true
      }
    ],

    about: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    departments: [
      {
        type: String,
        required: true
      }
    ],

    infrastructure: [
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

    internationalServices: [
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

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
