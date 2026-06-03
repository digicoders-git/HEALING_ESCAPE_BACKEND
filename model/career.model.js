import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    formType: {
      type: String,
      required: true,
      enum: ["global_ambassador", "internship", "full_time", "b2b_partnership"],
    },
    fullName: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    languagesKnown: {
      type: String,
      trim: true,
      default: "",
    },
    occupation: {
      type: String,
      trim: true,
      default: "",
    },
    highestQualification: {
      type: String,
      trim: true,
      default: "",
    },
    fileUrl: {
      type: String,
      default: "",
    },
    filePublicId: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      default: "",
    },
    education: {
      ug: { type: String, default: "" },
      pg: { type: String, default: "" },
      diploma: { type: String, default: "" },
    },
    skills: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: String,
      trim: true,
      default: "",
    },
    linkedinId: {
      type: String,
      trim: true,
      default: "",
    },
    branch: {
      type: String,
      trim: true,
      default: "",
    },
    branchRole: {
      type: String,
      trim: true,
      default: "",
    },
    organizationName: {
      type: String,
      trim: true,
      default: "",
    },
    designation: {
      type: String,
      trim: true,
      default: "",
    },
    partnershipType: {
      type: String,
      trim: true,
      default: "",
    },
    whyJoin: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Career", careerSchema);
