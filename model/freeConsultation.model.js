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
    },
    source: {
      type: String,
      enum: ["web", "admin", "employee"],
      default: "web"
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null
    },

    leadStatus: {
      type: String,
      enum: ["new", "contacted", "in-progress", "converted", "closed", "negative"],
      default: "new"
    },
    negativeReason: {
      type: String,
      default: ""
    }


  },
  { timestamps: true }
);

export default mongoose.model("FreeConsultation", freeConsultationSchema);
