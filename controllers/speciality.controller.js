import Speciality from "../model/speciality.model.js";
import { getFileUrl, getFilePublicId, deleteUploadedFile } from "../utils/fileUpload.js";

/* =========================
   CREATE SPECIALITY
========================= */
export const createSpeciality = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const speciality = await Speciality.create({
      title,
      description,
      image: getFileUrl(req, req.file),
      imagePublicId: getFilePublicId(req.file)
    });

    return res.status(201).json({
      success: true,
      message: "Speciality created successfully",
      data: speciality
    });

  } catch (error) {
    console.error("Create Speciality Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

/* =========================
   GET ALL (Search + Filter + Pagination)
========================= */
export const getAllSpecialities = async (req, res) => {
  try {
    const { page = 1, limit = 109090090900, search, isActive } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    let query = {};

    // 🔍 Global Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // 🎯 Filter
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const total = await Speciality.countDocuments(query);

    const data = await Speciality.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data
    });

  } catch (error) {
    console.error("Get All Specialities Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
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
      data: speciality
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   UPDATE SPECIALITY
========================= */
export const updateSpeciality = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;

    const speciality = await Speciality.findById(req.params.id);

    if (!speciality) {
      return res.status(404).json({
        success: false,
        message: "Speciality not found"
      });
    }

    // 🖼️ If new image uploaded
    if (req.file) {
      // delete old image
      if (speciality.imagePublicId || speciality.image) {
        deleteUploadedFile(speciality.imagePublicId || speciality.image);
      }

      speciality.image = getFileUrl(req, req.file);
      speciality.imagePublicId = getFilePublicId(req.file);
    }

    if (title) speciality.title = title;
    if (description) speciality.description = description;
    if (isActive !== undefined) speciality.isActive = isActive;

    await speciality.save();

    return res.status(200).json({
      success: true,
      message: "Speciality updated successfully",
      data: speciality
    });

  } catch (error) {
    console.error("Update Speciality Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
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

    // Delete image from uploads
    if (speciality.imagePublicId || speciality.image) {
      deleteUploadedFile(speciality.imagePublicId || speciality.image);
    }

    await speciality.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Speciality deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
/* =========================
   TOGGLE SPECIALITY STATUS
========================= */
export const toggleSpecialityStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const speciality = await Speciality.findById(id);

    if (!speciality) {
      return res.status(404).json({
        success: false,
        message: "Speciality not found"
      });
    }

    // 🔁 Toggle
    speciality.isActive = !speciality.isActive;
    await speciality.save();

    return res.status(200).json({
      success: true,
      message: `Speciality ${speciality.isActive ? "Activated" : "Deactivated"} successfully`,
      data: speciality
    });

  } catch (error) {
    console.error("Toggle Speciality Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
