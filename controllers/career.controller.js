import Career from "../model/career.model.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   CREATE CAREER APPLICATION
   ========================= */
export const createCareer = async (req, res) => {
  try {
    const {
      formType,
      fullName,
      country,
      city,
      phone,
      email,
      languagesKnown,
      occupation,
      highestQualification,
      age,
      gender,
      educationUg,
      educationPg,
      educationDiploma,
      skills,
      experience,
      linkedinId,
      branch,
      branchRole,
      organizationName,
      designation,
      partnershipType,
    } = req.body;

    if (!formType) {
      return res.status(400).json({
        success: false,
        message: "Form type is required",
      });
    }

    let fileUrl = "";
    let filePublicId = "";

    // If file is uploaded, upload to cloudinary
    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "careers",
          resource_type: "auto",
        });
        fileUrl = uploadResult.secure_url;
        filePublicId = uploadResult.public_id;
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload CV/Document to cloud storage",
        });
      }
    }

    // Construct education object if applicable
    const education = {
      ug: educationUg || "",
      pg: educationPg || "",
      diploma: educationDiploma || "",
    };

    const careerData = {
      formType,
      fullName: fullName || "",
      country: country || "",
      city: city || "",
      phone: phone || "",
      email: email || "",
      languagesKnown: languagesKnown || "",
      occupation: occupation || "",
      highestQualification: highestQualification || "",
      fileUrl,
      filePublicId,
      age: age ? Number(age) : undefined,
      gender: gender || "",
      education,
      skills: skills || "",
      experience: experience || "",
      linkedinId: linkedinId || "",
      branch: branch || "",
      branchRole: branchRole || "",
      organizationName: organizationName || "",
      designation: designation || "",
      partnershipType: partnershipType || "",
    };

    const newCareer = await Career.create(careerData);

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: newCareer,
    });
  } catch (error) {
    console.error("Create Career Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/* =========================
   GET ALL CAREER APPLICATIONS
   (Pagination + Search + Filter by FormType)
   ========================= */
export const getAllCareers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, formType } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = {};

    // 🔎 Filter by formType
    if (formType && formType !== "All") {
      query.formType = formType;
    }

    // 🔍 GLOBAL SEARCH
    if (search && search.trim() !== "") {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { organizationName: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
        { branchRole: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Career.countDocuments(query);

    const data = await Career.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    console.error("Get All Careers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================
   GET SINGLE CAREER APPLICATION
   ========================= */
export const getSingleCareer = async (req, res) => {
  try {
    const data = await Career.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Single Career Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =========================
   DELETE CAREER APPLICATION
   ========================= */
export const deleteCareer = async (req, res) => {
  try {
    const data = await Career.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Delete file from Cloudinary if it exists
    if (data.filePublicId) {
      try {
        await cloudinary.uploader.destroy(data.filePublicId);
      } catch (err) {
        console.error("Failed to delete file from Cloudinary:", err.message);
      }
    }

    await data.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete Career Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
