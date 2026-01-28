import FreeConsultation from "../model/freeConsultation.model.js";
import FollowUp from "../model/CRM/followUp.model.js";

/* =========================
   CREATE
========================= */
export const createFreeConsultation = async (req, res) => {
  try {
    const {
      fullName,
      country,
      city,
      countryCode,
      mobile,
      clinicalRequirement
    } = req.body;

    if (!fullName || !country || !city || !mobile || !clinicalRequirement) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 🔥 AUTO DETECT SOURCE
    // Agar token valid hai aur admin middleware laga hai => admin
    // Warna => web
    let source = "web";

    if (req.admin || req.user?.role === "admin") {
      source = "admin";
    }

    const data = await FreeConsultation.create({
      fullName,
      country,
      city,
      countryCode: countryCode || "+91",
      mobile,
      clinicalRequirement,
      source
    });

    return res.status(201).json({
      success: true,
      message: "Free consultation created successfully",
      data
    });
  } catch (error) {
    console.error("Create FreeConsultation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


/* =========================
   GET ALL
========================= */
export const getAllFreeConsultations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 1009090909090909,
      search,
      source,
      country,
      city,
      leadStatus,
      assignedTo
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    let query = {};

    // 🎯 Exact Filters
    if (source && ["web", "admin", "employee"].includes(source)) {
      query.source = source;
    }

    if (leadStatus && ["new", "contacted", "in-progress", "converted", "closed"].includes(leadStatus)) {
      query.leadStatus = leadStatus;
    }

    if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
      query.assignedTo = assignedTo;
    }

    if (country) {
      query.country = { $regex: country, $options: "i" };
    }

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    // 🔍 Global Search (almost all useful fields)
    if (search && search.trim() !== "") {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { clinicalRequirement: { $regex: search, $options: "i" } },
        { source: { $regex: search, $options: "i" } },
        { leadStatus: { $regex: search, $options: "i" } }
      ];
    }

    const total = await FreeConsultation.countDocuments(query);

    const data = await FreeConsultation.find(query)
      .populate("assignedTo", "name phone department")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      data
    });
  } catch (error) {
    console.error("Get All FreeConsultation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};




/* =========================
   UPDATE
========================= */
export const updateFreeConsultation = async (req, res) => {
  try {
    const data = await FreeConsultation.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Free consultation not found"
      });
    }

    const fields = [
      "fullName",
      "country",
      "city",
      "countryCode",
      "mobile",
      "clinicalRequirement"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    });

    await data.save();

    return res.status(200).json({
      success: true,
      message: "Free consultation updated successfully",
      data
    });
  } catch (error) {
    console.error("Update FreeConsultation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   DELETE
========================= */
export const deleteFreeConsultation = async (req, res) => {
  try {
    const data = await FreeConsultation.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Free consultation not found"
      });
    }

    await data.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Free consultation deleted successfully"
    });
  } catch (error) {
    console.error("Delete FreeConsultation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   GET SINGLE
========================= */
import mongoose from "mongoose";

export const getSingleFreeConsultation = async (req, res) => {
  try {
    const data = await FreeConsultation.findById(req.params.id)
      .populate("assignedTo", "name phone department");

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Free consultation not found"
      });
    }

    // ✅ Get all followups of this lead
    const followUps = await FollowUp.find({ lead: data._id })
      .populate("employee", "name phone")
      .sort({ createdAt: -1 });

    const totalFollowUps = followUps.length;

    const obj = data.toObject();
    obj.totalFollowUps = totalFollowUps;
    obj.followUps = followUps;   // 🔥 FULL LIST ADDED

    return res.status(200).json({
      success: true,
      data: obj   // ✅ SAME RESPONSE SHAPE, JUST ONE EXTRA FIELD
    });
  } catch (error) {
    console.error("Get Single FreeConsultation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

