import cloudinary from "../../config/cloudinary.js";
import Employee from "../../model/CRM/employee.model.js";
import freeConsultationModel from "../../model/freeConsultation.model.js";

/* =========================
   CREATE EMPLOYEE
========================= */
export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      department,
      designation
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required"
      });
    }

    // Check duplicate phone or email
    if (email) {
      const exist = await Employee.findOne({ email });
      if (exist) {
        return res.status(400).json({
          success: false,
          message: "Employee already exists with this email"
        });
      }
    }

    const existPhone = await Employee.findOne({ phone });
    if (existPhone) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists with this phone"
      });
    }

    // Upload image if exists
    let profilePhoto = { url: "", public_id: "" };

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "employees"
      });

      profilePhoto = {
        url: upload.secure_url,
        public_id: upload.public_id
      };
    }

    const employee = await Employee.create({
      name,
      email,
      phone,
      password,
      department,
      designation,
      profilePhoto
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee
    });
  } catch (error) {
    console.error("Create Employee Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   GET ALL EMPLOYEES
========================= */
export const getAllEmployees = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, isActive } = req.query;

    let matchStage = {};

    // 🔍 Search filter
    if (search && search.trim() !== "") {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } }
      ];
    }

    // 🟢🔴 isActive filter
    if (isActive === "true") {
      matchStage.isActive = true;
    } else if (isActive === "false") {
      matchStage.isActive = false;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const pipeline = [
      { $match: matchStage },

      // 🔥 JOIN WITH FREECONSULTATION
      {
        $lookup: {
          from: "freeconsultations", // ⚠️ collection name
          localField: "_id",
          foreignField: "assignedTo",
          as: "leads"
        }
      },

      // 🔥 ADD COUNT FIELD
      {
        $addFields: {
          totalLeadsAssigned: { $size: "$leads" }
        }
      },

      // ❌ remove leads array
      {
        $project: {
          leads: 0
        }
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: Number(limit) }
    ];

    const data = await Employee.aggregate(pipeline);

    const total = await Employee.countDocuments(matchStage);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      data
    });
  } catch (error) {
    console.error("Get All Employees Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


/* =========================
   GET SINGLE EMPLOYEE
========================= */
export const getSingleEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // 🔥 LIVE COUNT FROM LEADS COLLECTION
    const totalLeadsAssigned = await freeConsultationModel.countDocuments({
      assignedTo: employee._id
    });

    // convert mongoose doc to object
    const empObj = employee.toObject();

    // override field
    empObj.totalLeadsAssigned = totalLeadsAssigned;

    return res.status(200).json({
      success: true,
      data: empObj
    });
  } catch (error) {
    console.error("Get Single Employee Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   UPDATE EMPLOYEE
========================= */
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    const {
      name,
      email,
      phone,
      department,
      designation,
      isActive
    } = req.body;

    // Update fields if provided
    if (name !== undefined) employee.name = name;
    if (email !== undefined) employee.email = email;
    if (phone !== undefined) employee.phone = phone;
    if (department !== undefined) employee.department = department;
    if (designation !== undefined) employee.designation = designation;
    if (isActive !== undefined) employee.isActive = isActive;

    // If new image uploaded
    if (req.file) {
      // Delete old image
      if (employee.profilePhoto?.public_id) {
        await cloudinary.uploader.destroy(employee.profilePhoto.public_id);
      }

      // Upload new
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "employees"
      });

      employee.profilePhoto = {
        url: upload.secure_url,
        public_id: upload.public_id
      };
    }

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee
    });
  } catch (error) {
    console.error("Update Employee Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   DELETE EMPLOYEE
========================= */
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Delete image from cloudinary
    if (employee.profilePhoto?.public_id) {
      await cloudinary.uploader.destroy(employee.profilePhoto.public_id);
    }

    await employee.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (error) {
    console.error("Delete Employee Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   ACTIVATE / DEACTIVATE
========================= */
export const toggleEmployeeStatus = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    employee.isActive = !employee.isActive;
    await employee.save();

    return res.status(200).json({
      success: true,
      message: `Employee ${employee.isActive ? "activated" : "deactivated"} successfully`,
      data: employee
    });
  } catch (error) {
    console.error("Toggle Employee Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
