import jwt from "jsonwebtoken";
import Employee from "../model/CRM/employee.model.js";

const employeeAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const employee = await Employee.findById(decoded.id);

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    if (!employee.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked"
      });
    }

    req.employee = employee;
    req.employeeId = employee._id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
};

export default employeeAuth;
