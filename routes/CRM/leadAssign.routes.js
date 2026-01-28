import express from "express";
import {
  assignLeads,
  unassignLeads,
  getUnassignedLeads,
  getLeadsByEmployee
} from "../../controllers/CRM/leadAssign.controller.js";

const leadAssignRoute = express.Router();

leadAssignRoute.post("/assign", assignLeads);        // bulk assign
leadAssignRoute.post("/unassign", unassignLeads);    // bulk unassign
leadAssignRoute.get("/unassigned", getUnassignedLeads);
leadAssignRoute.get("/by-employee/:employeeId", getLeadsByEmployee);

export default leadAssignRoute;
