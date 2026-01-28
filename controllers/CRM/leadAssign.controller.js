
import Employee from "../../model/CRM/employee.model.js";
import freeConsultationModel from "../../model/freeConsultation.model.js";

/* =========================
   ASSIGN SINGLE OR MULTIPLE LEADS
========================= */
export const assignLeads = async (req, res) => {
  try {
    const { leadIds, employeeId } = req.body;

    // leadIds = ["id1", "id2", "id3"]

    if (!Array.isArray(leadIds) || leadIds.length === 0 || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "leadIds (array) and employeeId are required"
      });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee || !employee.isActive) {
      return res.status(404).json({
        success: false,
        message: "Employee not found or inactive"
      });
    }

    // Update many leads at once
    const result = await freeConsultationModel.updateMany(
      { _id: { $in: leadIds } },
      {
        $set: {
          assignedTo: employeeId,
          leadStatus: "in-progress"
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Leads assigned successfully",
      matched: result.matchedCount,
      modified: result.modifiedCount
    });
  } catch (error) {
    console.error("Assign Leads Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   UNASSIGN SINGLE OR MULTIPLE LEADS
========================= */
export const unassignLeads = async (req, res) => {
  try {
    const { leadIds } = req.body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "leadIds array is required"
      });
    }

    const result = await freeConsultationModel.updateMany(
      { _id: { $in: leadIds } },
      {
        $set: {
          assignedTo: null,
          leadStatus: "new"
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Leads unassigned successfully",
      matched: result.matchedCount,
      modified: result.modifiedCount
    });
  } catch (error) {
    console.error("Unassign Leads Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   GET UNASSIGNED LEADS
========================= */
export const getUnassignedLeads = async (req, res) => {
  try {
    const leads = await freeConsultationModel.find({
      assignedTo: null
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: leads.length,
      data: leads
    });
  } catch (error) {
    console.error("Get Unassigned Leads Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   GET LEADS OF EMPLOYEE
========================= */
export const getLeadsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const leads = await freeConsultationModel.find({
      assignedTo: employeeId
    })
      .populate("assignedTo", "name phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: leads.length,
      data: leads
    });
  } catch (error) {
    console.error("Get Leads By Employee Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
