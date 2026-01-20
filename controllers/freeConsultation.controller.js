import FreeConsultation from "../model/freeConsultation.model.js";

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

    const data = await FreeConsultation.create({
      fullName,
      country,
      city,
      countryCode: countryCode || "+91",
      mobile,
      clinicalRequirement
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
    const { page = 1, limit = 100090000, search } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    let query = {};

    // 🔍 GLOBAL SEARCH
    if (search && search.trim() !== "") {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { clinicalRequirement: { $regex: search, $options: "i" } }
      ];
    }

    const total = await FreeConsultation.countDocuments(query);

    const data = await FreeConsultation.find(query)
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
export const getSingleFreeConsultation = async (req, res) => {
  try {
    const data = await FreeConsultation.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Free consultation not found"
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Get Single FreeConsultation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
