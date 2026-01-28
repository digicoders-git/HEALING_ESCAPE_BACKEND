import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    /* ============ BASIC INFO ============ */
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true
    },

    password: {
      type: String
    },

    /* ============ WORK INFO ============ */
    department: {
      type: String, // sales, medical, support
      default: "sales"
    },

    designation: {
      type: String // Senior Counsellor, Junior, etc
    },

    /* ============ STATUS ============ */
    isActive: {
      type: Boolean,
      default: true
    },

    /* ============ LOGIN TRACKING ============ */
    lastLogin: {
      type: Date,
      default: null
    },

    /* ============ LEAD STATS (Optional but powerful) ============ */
    totalLeadsAssigned: {
      type: Number,
      default: 0
    },

    totalLeadsClosed: {
      type: Number,
      default: 0
    },

    /* ============ PROFILE ============ */
    profilePhoto: {
      url: String,
      public_id: String
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee
