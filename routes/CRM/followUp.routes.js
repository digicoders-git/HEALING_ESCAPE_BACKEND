import express from "express";
import {
  addFollowUp,
  getMyFollowUps,
  markFollowUpDone,
  getFollowUpHistoryByLead,
  getUpcomingFollowUps
} from "../../controllers/CRM/followUp.controller.js";

const followUpRouter = express.Router();

followUpRouter.post("/add", addFollowUp);
followUpRouter.get("/my/:employeeId", getMyFollowUps);
followUpRouter.patch("/done/:id", markFollowUpDone);
followUpRouter.get("/history/:leadId", getFollowUpHistoryByLead);
followUpRouter.get("/upcoming/:employeeId", getUpcomingFollowUps);


export default followUpRouter;
