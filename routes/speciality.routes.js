import express from "express";
import upload from "../middleware/multer.js";
import {
  createSpeciality,
  getAllSpecialities,
  getSingleSpeciality,
  updateSpeciality,
  deleteSpeciality,
  toggleSpecialityStatus
} from "../controllers/speciality.controller.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";

const specialityRouter = express.Router();

specialityRouter.post("/create",verifyAdminToken, upload.single("image"), createSpeciality);
specialityRouter.get("/all", getAllSpecialities);
specialityRouter.get("/:id", getSingleSpeciality);
specialityRouter.put("/update/:id",verifyAdminToken, upload.single("image"), updateSpeciality);
specialityRouter.patch("/status/:id",verifyAdminToken, toggleSpecialityStatus);
specialityRouter.delete("/delete/:id",verifyAdminToken, deleteSpeciality);

export default specialityRouter;
