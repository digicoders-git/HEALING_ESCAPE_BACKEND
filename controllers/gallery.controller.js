import Gallery from "../model/gallery.model.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   CREATE GALLERY
========================= */
export const createGallery = async (req, res) => {
  try {
    const { category, caption } = req.body;

    if (!category || !caption) {
      return res.status(400).json({
        success: false,
        message: "Category and caption are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "gallery"
    });

    const gallery = await Gallery.create({
      category,
      caption,
      image: upload.secure_url,
      imagePublicId: upload.public_id
    });

    return res.status(201).json({
      success: true,
      message: "Gallery image added successfully",
      gallery
    });
  } catch (error) {
    console.error("Create gallery error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   GET ALL (FILTER + SEARCH + PAGINATION)
========================= */
export const getAllGallery = async (req, res) => {
  try {
    const { search, category, isActive, page = 1, limit = 120000000 } = req.query;

    const query = {};

    // 🔍 Search by caption
    if (search) {
      query.caption = { $regex: search, $options: "i" };
    }

    // 🎯 Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // 🎯 Filter by status
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Gallery.countDocuments(query);

    const gallery = await Gallery.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      gallery
    });
  } catch (error) {
    console.error("Get gallery error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   GET SINGLE
========================= */
export const getSingleGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    return res.status(200).json({
      success: true,
      gallery
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid ID"
    });
  }
};

/* =========================
   UPDATE GALLERY
========================= */
export const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    if (req.body.category !== undefined) gallery.category = req.body.category;
    if (req.body.caption !== undefined) gallery.caption = req.body.caption;
    if (req.body.isActive !== undefined) gallery.isActive = req.body.isActive;

    // 🔁 If new image uploaded
    if (req.file) {
      // 🔥 Delete old image
      if (gallery.imagePublicId) {
        await cloudinary.uploader.destroy(gallery.imagePublicId);
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "gallery"
      });

      gallery.image = upload.secure_url;
      gallery.imagePublicId = upload.public_id;
    }

    await gallery.save();

    return res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      gallery
    });
  } catch (error) {
    console.error("Update gallery error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   TOGGLE STATUS
========================= */
export const toggleGalleryStatus = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    gallery.isActive = !gallery.isActive;
    await gallery.save();

    return res.status(200).json({
      success: true,
      message: `Gallery item ${gallery.isActive ? "Activated" : "Deactivated"}`,
      isActive: gallery.isActive
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   DELETE GALLERY
========================= */
export const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    // 🔥 Delete from cloudinary
    if (gallery.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(gallery.imagePublicId);
      } catch (err) {
        console.error("Cloudinary delete failed:", err.message);
      }
    }

    await gallery.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
