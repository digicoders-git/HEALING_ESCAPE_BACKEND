import express from "express";
import upload from "../middleware/multer.js";
import {
  createHospital,
  getAllHospitals,
  getSingleHospital,
  updateHospital,
  deleteHospital,
  toggleHospitalStatus,
  getHospitalsForDropdown
} from "../controllers/hospital.controller.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";

const hospitalRouter = express.Router();

hospitalRouter.post("/create",verifyAdminToken, upload.single("image"), createHospital);
hospitalRouter.get("/all", getAllHospitals);
hospitalRouter.get("/:id", getSingleHospital);
hospitalRouter.put("/update/:id",verifyAdminToken, upload.single("image"), updateHospital);
hospitalRouter.patch("/status/:id",verifyAdminToken, toggleHospitalStatus);
hospitalRouter.delete("/delete/:id",verifyAdminToken, deleteHospital);
hospitalRouter.get("/dropdown/list", getHospitalsForDropdown);

export default hospitalRouter;
