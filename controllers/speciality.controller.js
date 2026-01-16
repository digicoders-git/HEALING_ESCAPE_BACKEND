import Speciality from "../model/speciality.model.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   CREATE SPECIALITY
========================= */
export const createSpeciality = async (req, res) => {
  try {
    const {
      title,
      description,
      whatIs,
      whenRecommended,
      procedure,
      recovery,
      costRange
    } = req.body;

    if (
      !title ||
      !description ||
      !whatIs ||
      !procedure ||
      !recovery ||
      !costRange
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const exist = await Speciality.findOne({ title });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Speciality already exists"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    // ⬆️ Upload to cloudinary
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "specialities"
    });

    const speciality = await Speciality.create({
      title,
      image: upload.secure_url,
      imagePublicId: upload.public_id,
      description,
      whatIs,
      whenRecommended: JSON.parse(whenRecommended),
      procedure,
      recovery,
      costRange
    });

    return res.status(201).json({
      success: true,
      message: "Speciality created successfully",
      speciality
    });
  } catch (error) {
    console.error("Create speciality error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   GET ALL (SEARCH + FILTER + PAGINATION)
========================= */
export const getAllSpecialities = async (req, res) => {
  try {
    const { search, isActive, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Speciality.countDocuments(query);

    const specialities = await Speciality.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      specialities
    });
  } catch (error) {
    console.error("Get specialities error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   GET SINGLE
========================= */
export const getSingleSpeciality = async (req, res) => {
  try {
    const speciality = await Speciality.findById(req.params.id);

    if (!speciality) {
      return res.status(404).json({
        success: false,
        message: "Speciality not found"
      });
    }

    return res.status(200).json({
      success: true,
      speciality
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid ID"
    });
  }
};

/* =========================
   UPDATE SPECIALITY
========================= */
export const updateSpeciality = async (req, res) => {
  try {
    const speciality = await Speciality.findById(req.params.id);

    if (!speciality) {
      return res.status(404).json({
        success: false,
        message: "Speciality not found"
      });
    }

    const fields = [
      "title",
      "description",
      "whatIs",
      "procedure",
      "recovery",
      "costRange",
      "isActive"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        speciality[field] = req.body[field];
      }
    });

    if (req.body.whenRecommended) {
      speciality.whenRecommended = JSON.parse(req.body.whenRecommended);
    }

    // 🔁 If new image uploaded
    if (req.file) {
      // 🔥 Delete old image
      if (speciality.imagePublicId) {
        await cloudinary.uploader.destroy(speciality.imagePublicId);
      }

      // ⬆️ Upload new
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "specialities"
      });

      speciality.image = upload.secure_url;
      speciality.imagePublicId = upload.public_id;
    }

    await speciality.save();

    return res.status(200).json({
      success: true,
      message: "Speciality updated successfully",
      speciality
    });
  } catch (error) {
    console.error("Update speciality error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   TOGGLE STATUS
========================= */
export const toggleSpecialityStatus = async (req, res) => {
  try {
    const speciality = await Speciality.findById(req.params.id);

    if (!speciality) {
      return res.status(404).json({
        success: false,
        message: "Speciality not found"
      });
    }

    speciality.isActive = !speciality.isActive;
    await speciality.save();

    return res.status(200).json({
      success: true,
      message: `Speciality ${speciality.isActive ? "Activated" : "Deactivated"}`,
      isActive: speciality.isActive
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   DELETE SPECIALITY
========================= */
export const deleteSpeciality = async (req, res) => {
  try {
    const speciality = await Speciality.findById(req.params.id);

    if (!speciality) {
      return res.status(404).json({
        success: false,
        message: "Speciality not found"
      });
    }

    // 🔥 Delete image from cloudinary
    if (speciality.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(speciality.imagePublicId);
      } catch (err) {
        console.error("Cloudinary delete failed:", err.message);
      }
    }

    await speciality.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Speciality deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
