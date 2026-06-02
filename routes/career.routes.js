import express from "express";
import upload from "../middleware/multer.js";
import {
  createCareer,
  getAllCareers,
  getSingleCareer,
  deleteCareer,
} from "../controllers/career.controller.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";

const careerRouter = express.Router();

// Public submission route. Expects form-data and handles a single uploaded file named "file"
careerRouter.post("/create", upload.single("file"), createCareer);

// Protected admin routes
careerRouter.get("/all", verifyAdminToken, getAllCareers);
careerRouter.get("/:id", verifyAdminToken, getSingleCareer);
careerRouter.delete("/delete/:id", verifyAdminToken, deleteCareer);

export default careerRouter;
