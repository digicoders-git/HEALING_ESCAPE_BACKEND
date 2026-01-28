import express from "express";
import { changeEmployeePassword, employeeLogin, getMyProfile } from "../../controllers/employee_CRM/employeeAuth.controller.js";
import employeeAuth from "../../middleware/employeeAuth.js";
import { createLeadByEmployee, getMyLeads } from "../../controllers/employee_CRM/employeeLead.controller.js";

const employeeAuthRouter = express.Router();

employeeAuthRouter.post("/login", employeeLogin);
employeeAuthRouter.get("/me", employeeAuth, getMyProfile);
employeeAuthRouter.post("/change-password", employeeAuth, changeEmployeePassword);
employeeAuthRouter.post("/add-lead", employeeAuth, createLeadByEmployee);
employeeAuthRouter.get("/my-leads", employeeAuth, getMyLeads);

export default employeeAuthRouter;
