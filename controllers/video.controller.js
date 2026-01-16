import Video from "../model/video.model.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   CREATE VIDEO
========================= */
export const createVideo = async (req, res) => {
  try {
    const {
      title,
      category,
      duration,
      description,
      whatYouWillLearn
    } = req.body;

    if (
      !title ||
      !category ||
      !duration ||
      !description ||
      !whatYouWillLearn
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!req.files?.thumbnail || !req.files?.video) {
      return res.status(400).json({
        success: false,
        message: "Both thumbnail and video are required"
      });
    }

    // ⬆️ Upload thumbnail
    const thumbUpload = await cloudinary.uploader.upload(
      req.files.thumbnail[0].path,
      {
        folder: "videos/thumbnails"
      }
    );

    // ⬆️ Upload video
    const videoUpload = await cloudinary.uploader.upload(
      req.files.video[0].path,
      {
        folder: "videos/files",
        resource_type: "video"
      }
    );

    const video = await Video.create({
      title,
      category,
      thumbnail: thumbUpload.secure_url,
      thumbnailPublicId: thumbUpload.public_id,

      videoUrl: videoUpload.secure_url,
      videoPublicId: videoUpload.public_id,

      duration,
      description,
      whatYouWillLearn: JSON.parse(whatYouWillLearn)
    });

    return res.status(201).json({
      success: true,
      message: "Video created successfully",
      video
    });
  } catch (error) {
    console.error("Create video error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   GET ALL (SEARCH + FILTER + PAGINATION)
========================= */
export const getAllVideos = async (req, res) => {
  try {
    const { search, category, isActive, page = 1, limit = 100000000 } = req.query;

    const query = {};

    // 🔍 Search by title
    if (search) {
      query.title = { $regex: search, $options: "i" };
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

    const total = await Video.countDocuments(query);

    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      videos
    });
  } catch (error) {
    console.error("Get videos error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   GET SINGLE
========================= */
export const getSingleVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    return res.status(200).json({
      success: true,
      video
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid ID"
    });
  }
};

/* =========================
   UPDATE VIDEO (FULL)
========================= */
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    const fields = [
      "title",
      "category",
      "duration",
      "description",
      "isActive"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        video[field] = req.body[field];
      }
    });

    if (req.body.whatYouWillLearn) {
      video.whatYouWillLearn = JSON.parse(req.body.whatYouWillLearn);
    }

    // 🔁 Update thumbnail
    if (req.files?.thumbnail) {
      if (video.thumbnailPublicId) {
        await cloudinary.uploader.destroy(video.thumbnailPublicId);
      }

      const thumbUpload = await cloudinary.uploader.upload(
        req.files.thumbnail[0].path,
        { folder: "videos/thumbnails" }
      );

      video.thumbnail = thumbUpload.secure_url;
      video.thumbnailPublicId = thumbUpload.public_id;
    }

    // 🔁 Update video file
    if (req.files?.video) {
      if (video.videoPublicId) {
        await cloudinary.uploader.destroy(video.videoPublicId, {
          resource_type: "video"
        });
      }

      const videoUpload = await cloudinary.uploader.upload(
        req.files.video[0].path,
        {
          folder: "videos/files",
          resource_type: "video"
        }
      );

      video.videoUrl = videoUpload.secure_url;
      video.videoPublicId = videoUpload.public_id;
    }

    await video.save();

    return res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video
    });
  } catch (error) {
    console.error("Update video error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


/* =========================
   TOGGLE STATUS
========================= */
export const toggleVideoStatus = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    video.isActive = !video.isActive;
    await video.save();

    return res.status(200).json({
      success: true,
      message: `Video ${video.isActive ? "Activated" : "Deactivated"}`,
      isActive: video.isActive
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   DELETE VIDEO
========================= */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    // 🔥 Delete thumbnail
    if (video.thumbnailPublicId) {
      await cloudinary.uploader.destroy(video.thumbnailPublicId);
    }

    // 🔥 Delete video file
    if (video.videoPublicId) {
      await cloudinary.uploader.destroy(video.videoPublicId, {
        resource_type: "video"
      });
    }

    await video.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};