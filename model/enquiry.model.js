import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
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

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true
    },

    preferredCity: {
      type: String,
      default: ""
    },

    message: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
