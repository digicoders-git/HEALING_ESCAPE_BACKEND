import mongoose from "mongoose";

const freeConsultationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    country: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    countryCode: {
      type: String,
      default: "+91"
    },

    mobile: {
      type: String,
      required: true
    },

    clinicalRequirement: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("FreeConsultation", freeConsultationSchema);
