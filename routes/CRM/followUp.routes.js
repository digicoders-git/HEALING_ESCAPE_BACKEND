import express from "express";
import {
  addFollowUp,
  getMyFollowUps,
  getAllFollowUps,
  markFollowUpDone,
  getFollowUpHistoryByLead,
  getUpcomingFollowUps,
  getTodaysReminders,
  getMonthFollowUps
} from "../../controllers/CRM/followUp.controller.js";

const followUpRouter = express.Router();

followUpRouter.post("/add", addFollowUp);
followUpRouter.get("/my/:employeeId", getMyFollowUps);
followUpRouter.get("/all", getAllFollowUps);
followUpRouter.patch("/done/:id", markFollowUpDone);
followUpRouter.get("/history/:leadId", getFollowUpHistoryByLead);
followUpRouter.get("/upcoming/:employeeId", getUpcomingFollowUps);
followUpRouter.get("/today/:employeeId", getTodaysReminders);
followUpRouter.get("/month/:employeeId", getMonthFollowUps);


export default followUpRouter;
