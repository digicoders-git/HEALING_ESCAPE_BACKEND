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
    },

    imagePublicId: {
      type: String,
    },

    accreditations: [
      {
        type: String,
      }
    ],

    specialities: [
      {
        type: String,
      }
    ],

    about: {
      type: String,
    },

    description: {
      type: String,
    },

    departments: [
      {
        type: String,
      }
    ],

    infrastructure: [
      {
        type: String,
      }
    ],

    whyChoose: [
      {
        type: String,
      }
    ],

    internationalServices: [
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

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
