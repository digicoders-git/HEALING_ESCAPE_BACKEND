import express from "express";
import {
  createEnquiry,
  getAllEnquiries,
  getSingleEnquiry,
  updateEnquiry,
  deleteEnquiry
} from "../controllers/enquiry.controller.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";

const enquiryRouter = express.Router();

enquiryRouter.post("/create", createEnquiry);
enquiryRouter.get("/all",verifyAdminToken, getAllEnquiries);
enquiryRouter.get("/:id",verifyAdminToken, getSingleEnquiry);
enquiryRouter.put("/update/:id",verifyAdminToken, updateEnquiry);
enquiryRouter.delete("/delete/:id",verifyAdminToken, deleteEnquiry);

export default enquiryRouter;
