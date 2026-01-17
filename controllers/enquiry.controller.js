import Enquiry from "../model/enquiry.model.js";

/* =========================
   CREATE ENQUIRY
========================= */
export const createEnquiry = async (req, res) => {
  try {
    const {
      fullName,
      country,
      email,
      phone,
      preferredCity,
      message
    } = req.body;

    if (!fullName || !country || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled"
      });
    }

    const enquiry = await Enquiry.create({
      fullName,
      country,
      email,
      phone,
      preferredCity,
      message
    });

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry
    });
  } catch (error) {
    console.error("Create Enquiry Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   GET ALL ENQUIRIES
   (Pagination + Search + Filter)
========================= */
export const getAllEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, country, preferredCity } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    let query = {};

    // 🔍 Search
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }

    // 🌍 Filters
    if (country) query.country = country;
    if (preferredCity) query.preferredCity = preferredCity;

    const total = await Enquiry.countDocuments(query);

    const data = await Enquiry.find(query)
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
    console.error("Get All Enquiries Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   GET SINGLE ENQUIRY
========================= */
export const getSingleEnquiry = async (req, res) => {
  try {
    const data = await Enquiry.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Get Single Enquiry Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   UPDATE ENQUIRY
========================= */
export const updateEnquiry = async (req, res) => {
  try {
    const data = await Enquiry.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    const fields = [
      "fullName",
      "country",
      "email",
      "phone",
      "preferredCity",
      "message"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    });

    await data.save();

    return res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data
    });
  } catch (error) {
    console.error("Update Enquiry Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   DELETE ENQUIRY
========================= */
export const deleteEnquiry = async (req, res) => {
  try {
    const data = await Enquiry.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    await data.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully"
    });
  } catch (error) {
    console.error("Delete Enquiry Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
