import express from "express";
import { getEmployeeDashboard } from "../../controllers/CRM/employeeDashboard.controller.js";

const employeeDashboardRouter = express.Router();

employeeDashboardRouter.get("/dashboard/:employeeId", getEmployeeDashboard);

export default employeeDashboardRouter;
