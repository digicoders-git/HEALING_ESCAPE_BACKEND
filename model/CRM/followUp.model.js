import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FreeConsultation",
      required: true
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },

    note: {
      type: String,
      required: true
    },

    nextFollowUpDate: {
      type: Date,
      required: false
    },

    status: {
      type: String,
      enum: ["pending", "done", "missed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const FollowUp = mongoose.model("FollowUp", followUpSchema);
export default FollowUp
