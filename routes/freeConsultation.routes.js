import express from "express";
import {
  createFreeConsultation,
  getAllFreeConsultations,
  getSingleFreeConsultation,
  updateFreeConsultation,
  deleteFreeConsultation
} from "../controllers/freeConsultation.controller.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";

const freeConsultationRouter = express.Router();

freeConsultationRouter.post("/create", createFreeConsultation);
freeConsultationRouter.post("/admin/create",verifyAdminToken, createFreeConsultation);
freeConsultationRouter.get("/all", getAllFreeConsultations);
freeConsultationRouter.get("/:id",verifyAdminToken, getSingleFreeConsultation);
freeConsultationRouter.put("/update/:id",verifyAdminToken, updateFreeConsultation);
freeConsultationRouter.delete("/delete/:id",verifyAdminToken, deleteFreeConsultation);

export default freeConsultationRouter;
