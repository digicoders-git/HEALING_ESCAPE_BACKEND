// import FreeConsultation from "../../model/CRM/freeConsultation.model.js";
import FollowUp from "../../model/CRM/followUp.model.js";
import freeConsultationModel from "../../model/freeConsultation.model.js";

/* =========================
   EMPLOYEE DASHBOARD
========================= */
export const getEmployeeDashboard = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const today = new Date();

    // 🔢 Total leads of employee
    const totalLeads = await freeConsultationModel.countDocuments({
      assignedTo: employeeId
    });

    // ✅ Converted leads
    const convertedLeads = await freeConsultationModel.countDocuments({
      assignedTo: employeeId,
      leadStatus: "converted"
    });

    // 🔴 Today + Overdue followups
    const todayFollowUpsList = await FollowUp.find({
      employee: employeeId,
      nextFollowUpDate: { $lte: today },
      status: "pending"
    })
      .populate("lead", "fullName mobile city")
      .sort({ nextFollowUpDate: 1 });

    // 🟡 Upcoming followups
    const upcomingFollowUpsList = await FollowUp.find({
      employee: employeeId,
      nextFollowUpDate: { $gt: today },
      status: "pending"
    })
      .populate("lead", "fullName mobile city")
      .sort({ nextFollowUpDate: 1 });

    return res.status(200).json({
      success: true,
      stats: {
        totalLeads,
        convertedLeads,
        todayFollowUps: todayFollowUpsList.length,
        upcomingFollowUps: upcomingFollowUpsList.length
      },
      data: {
        todayFollowUpsList,
        upcomingFollowUpsList
      }
    });
  } catch (error) {
    console.error("Employee Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
