import Blog from "../model/blog.model.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   CREATE BLOG
========================= */
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      category,
      date,
      excerpt,
      introduction,
      content,
      whyThisMatters,
      relatedIds
    } = req.body;

    if (
      !title ||
      !category ||
      !date ||
      !excerpt ||
      !introduction ||
      !content ||
      !whyThisMatters
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    // ⬆️ Upload image
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "blogs"
    });

    const blog = await Blog.create({
      title,
      category,
      date,
      image: upload.secure_url,
      imagePublicId: upload.public_id,
      excerpt,
      introduction,
      content,
      whyThisMatters,
      relatedIds: relatedIds ? JSON.parse(relatedIds) : []
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog
    });
  } catch (error) {
    console.error("Create blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   GET ALL (SEARCH + FILTER + PAGINATION)
========================= */
export const getAllBlogs = async (req, res) => {
  try {
    const { search, category, isActive, page = 1, limit = 10000000 } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      blogs
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   GET SINGLE
========================= */
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("relatedIds");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid ID"
    });
  }
};

/* =========================
   UPDATE BLOG (FULL)
========================= */
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    const fields = [
      "title",
      "category",
      "date",
      "excerpt",
      "introduction",
      "content",
      "whyThisMatters",
      "isActive"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        blog[field] = req.body[field];
      }
    });

    if (req.body.relatedIds) {
      blog.relatedIds = JSON.parse(req.body.relatedIds);
    }

    // 🔁 Image update
    if (req.file) {
      if (blog.imagePublicId) {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogs"
      });

      blog.image = upload.secure_url;
      blog.imagePublicId = upload.public_id;
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog
    });
  } catch (error) {
    console.error("Update blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   TOGGLE STATUS
========================= */
export const toggleBlogStatus = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    blog.isActive = !blog.isActive;
    await blog.save();

    return res.status(200).json({
      success: true,
      message: `Blog ${blog.isActive ? "Activated" : "Deactivated"}`,
      isActive: blog.isActive
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   DELETE BLOG
========================= */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    // 🔥 Delete image from cloudinary
    if (blog.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      } catch (err) {
        console.error("Cloudinary delete failed:", err.message);
      }
    }

    await blog.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
