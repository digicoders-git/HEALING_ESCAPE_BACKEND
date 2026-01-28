import FollowUp from "../../model/CRM/followUp.model.js";
import freeConsultationModel from "../../model/freeConsultation.model.js";
// import FreeConsultation from "../../model/CRM/freeConsultation.model.js";

/* =========================
   ADD FOLLOW-UP
========================= */
export const addFollowUp = async (req, res) => {
  try {
    const { leadId, employeeId, note, nextFollowUpDate } = req.body;

    if (!leadId || !employeeId || !note) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // ✅ Check lead exists
    const lead = await freeConsultationModel.findById(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    // ❌ Block follow-up on final states
    if (["converted", "closed", "negative"].includes(lead.leadStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot add follow-up on ${lead.leadStatus} lead`
      });
    }

    const followup = await FollowUp.create({
      lead: leadId,
      employee: employeeId,
      note,
      nextFollowUpDate
    });

    // 🔥 AUTO: Follow-up add hua → lead CONTACTED
    await freeConsultationModel.findByIdAndUpdate(leadId, {
      leadStatus: "contacted"
    });

    return res.status(201).json({
      success: true,
      message: "Follow-up added successfully",
      data: followup
    });
  } catch (error) {
    console.error("Add FollowUp Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


/* =========================
   GET MY FOLLOW-UPS (With Server Side Filtering)
========================= */
export const getMyFollowUps = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status } = req.query;

    let query = { employee: employeeId };

    // Server side filtering by status
    if (status && status !== "all") {
      query.status = status;
    }

    const followups = await FollowUp.find(query)
      .populate("lead", "fullName mobile city clinicalRequirement leadStatus")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: followups.length,
      data: followups
    });
  } catch (error) {
    console.error("Get My FollowUps Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   GET ALL FOLLOW-UPS (Admin - With Server Side Filtering)
========================= */
export const getAllFollowUps = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};

    // Server side filtering by status
    if (status && status !== "all") {
      query.status = status;
    }

    const followups = await FollowUp.find(query)
      .populate("lead", "fullName mobile city clinicalRequirement leadStatus")
      .populate("employee", "name phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: followups.length,
      data: followups
    });
  } catch (error) {
    console.error("Get All FollowUps Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* =========================
   MARK FOLLOW-UP DONE
========================= */
export const markFollowUpDone = async (req, res) => {
  try {
    const { id } = req.params;

    const followup = await FollowUp.findById(id);
    if (!followup) {
      return res.status(404).json({
        success: false,
        message: "Follow-up not found"
      });
    }

    // ❌ Agar already MISSED hai to done mark nahi hoga
    if (followup.status === "missed") {
      return res.status(400).json({
        success: false,
        message: "Missed follow-up cannot be marked as done"
      });
    }

    // ❌ Agar already done hai
    if (followup.status === "done") {
      return res.status(400).json({
        success: false,
        message: "Follow-up is already marked as done"
      });
    }

    followup.status = "done";
    await followup.save();

    return res.status(200).json({
      success: true,
      message: "Follow-up marked as done",
      data: followup
    });
  } catch (error) {
    console.error("Mark FollowUp Done Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


/* =========================
   GET FOLLOW-UP HISTORY OF LEAD
========================= */
export const getFollowUpHistoryByLead = async (req, res) => {
  try {
    const { leadId } = req.params;

    const history = await FollowUp.find({ lead: leadId })
      .populate("employee", "name phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: history.length,
      data: history
    });
  } catch (error) {
    console.error("Get FollowUp History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const getUpcomingFollowUps = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const today = new Date();

    const followups = await FollowUp.find({
      employee: employeeId,
      nextFollowUpDate: { $gt: today },
      status: "pending"
    })
      .populate("lead", "fullName mobile city clinicalRequirement leadStatus")
      .sort({ nextFollowUpDate: 1 });

    return res.status(200).json({
      success: true,
      total: followups.length,
      data: followups
    });
  } catch (error) {
    console.error("Get Upcoming FollowUps Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const getTodaysReminders = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const followups = await FollowUp.find({
      employee: employeeId,
      nextFollowUpDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: "pending"
    })
      .populate("lead", "fullName mobile city clinicalRequirement leadStatus")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: followups.length,
      data: followups
    });
  } catch (error) {
    console.error("Get Todays Reminders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const getMonthFollowUps = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query; // Expecting month (0-11) and year (e.g., 2026)

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and Year are required"
      });
    }

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, parseInt(month) + 1, 0, 23, 59, 59, 999);

    const followups = await FollowUp.find({
      employee: employeeId,
      nextFollowUpDate: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    })
      .populate("lead", "fullName mobile city clinicalRequirement leadStatus")
      .sort({ nextFollowUpDate: 1 });

    return res.status(200).json({
      success: true,
      total: followups.length,
      data: followups
    });
  } catch (error) {
    console.error("Get Month FollowUps Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
