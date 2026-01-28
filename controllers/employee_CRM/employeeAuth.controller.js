import Employee from "../../model/CRM/employee.model.js";
import generateToken from "../../config/token.js";

/* =========================
   EMPLOYEE LOGIN
========================= */
export const employeeLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required"
      });
    }

    const employee = await Employee.findOne({ phone });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    if (!employee.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Contact admin."
      });
    }

    // ❗ Plain password compare (as you want)
    if (employee.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // Update last login
    employee.lastLogin = new Date();
    await employee.save();

    const token = generateToken(employee._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        phone: employee.phone,
        email: employee.email,
        department: employee.department,
        designation: employee.designation
      }
    });

  } catch (error) {
    console.error("Employee Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =========================
   GET MY PROFILE
========================= */
export const getMyProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.employee
  });
};

/* =========================
   CHANGE PASSWORD
========================= */
export const changeEmployeePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required"
      });
    }

    const employee = await Employee.findById(req.employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    if (employee.password !== oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect"
      });
    }

    employee.password = newPassword;
    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
