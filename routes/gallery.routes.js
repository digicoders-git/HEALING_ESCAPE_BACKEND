import express from "express";
import upload from "../middleware/multer.js";
import {
  createGallery,
  getAllGallery,
  getSingleGallery,
  updateGallery,
  deleteGallery,
  toggleGalleryStatus
} from "../controllers/gallery.controller.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";

const galleryRouter = express.Router();

galleryRouter.post("/create",verifyAdminToken, upload.single("image"), createGallery);
galleryRouter.get("/all", getAllGallery);
galleryRouter.get("/:id", getSingleGallery);
galleryRouter.put("/update/:id",verifyAdminToken, upload.single("image"), updateGallery);
galleryRouter.patch("/status/:id",verifyAdminToken, toggleGalleryStatus);
galleryRouter.delete("/delete/:id",verifyAdminToken, deleteGallery);

export default galleryRouter;
