import express from "express";
import upload from "../middleware/multer.js";
import {
  createDoctor,
  getAllDoctors,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
  toggleDoctorStatus
} from "../controllers/doctor.controller.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";

const doctorRouter = express.Router();

doctorRouter.post("/create",verifyAdminToken, upload.single("photo"), createDoctor);
doctorRouter.get("/all", getAllDoctors);
doctorRouter.get("/:id", getSingleDoctor);
doctorRouter.put("/update/:id",verifyAdminToken, upload.single("photo"), updateDoctor);
doctorRouter.patch("/status/:id",verifyAdminToken, toggleDoctorStatus);
doctorRouter.delete("/delete/:id", verifyAdminToken, deleteDoctor);

export default doctorRouter;
