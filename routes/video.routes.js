import express from "express";
// import upload from "../middleware/multer.js";
import {
  createVideo,
  getAllVideos,
  getSingleVideo,
  updateVideo,
  deleteVideo,
  toggleVideoStatus
} from "../controllers/video.controller.js";
import { verifyAdminToken } from "../middleware/verifyAdminToken.js";
import upload from "../middleware/multer.js";

const videoRouter = express.Router();

videoRouter.post("/create",verifyAdminToken,upload.fields([{ name: "thumbnail", maxCount: 1 },{ name: "video", maxCount: 1 }]),createVideo);
videoRouter.get("/all", getAllVideos);
videoRouter.get("/:id", getSingleVideo);
videoRouter.put("/update/:id",verifyAdminToken,upload.fields([{ name: "thumbnail", maxCount: 1 },{ name: "video", maxCount: 1 }]),updateVideo);
videoRouter.patch("/status/:id",verifyAdminToken, toggleVideoStatus);
videoRouter.delete("/delete/:id",verifyAdminToken, deleteVideo);

export default videoRouter;
