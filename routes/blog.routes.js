import express from "express";
import upload from "../middleware/multer.js";
import {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus
} from "../controllers/blog.controller.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";

const blogrouter = express.Router();

blogrouter.post("/create",verifyAdminToken, upload.single("image"), createBlog);
blogrouter.get("/all", getAllBlogs);
blogrouter.get("/:id", getSingleBlog);
blogrouter.put("/update/:id",verifyAdminToken, upload.single("image"), updateBlog);
blogrouter.patch("/status/:id",verifyAdminToken, toggleBlogStatus);
blogrouter.delete("/delete/:id",verifyAdminToken, deleteBlog);

export default blogrouter;
