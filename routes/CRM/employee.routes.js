import express from "express";
import upload from "../../middleware/multer.js";
import { createEmployee, deleteEmployee, getAllEmployees, getSingleEmployee, toggleEmployeeStatus, updateEmployee } from "../../controllers/CRM/employee.controller.js";
import { getEmployeeDashboard } from "../../controllers/CRM/employeeDashboard.controller.js";

const employeeRouter = express.Router();

employeeRouter.post("/create", upload.single("profilePhoto"), createEmployee);
employeeRouter.get("/all", getAllEmployees);
employeeRouter.get("/get/:id", getSingleEmployee);
employeeRouter.put("/update/:id", upload.single("profilePhoto"), updateEmployee);
employeeRouter.delete("/delete/:id", deleteEmployee);
employeeRouter.patch("/toggle-status/:id", toggleEmployeeStatus);
employeeRouter.get("/dashboard/:employeeId", getEmployeeDashboard);

export default employeeRouter;
