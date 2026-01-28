import FreeConsultation from "../../model/freeConsultation.model.js";

/* =========================
   EMPLOYEE ADD NEW LEAD
========================= */
export const createLeadByEmployee = async (req, res) => {
  try {
    const {
      fullName,
      country,
      city,
      mobile,
      clinicalRequirement,
      countryCode
    } = req.body;

    if (!fullName || !country || !city || !mobile || !clinicalRequirement) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Optional: prevent duplicate mobile leads
    const exist = await FreeConsultation.findOne({ mobile });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Lead already exists with this mobile number"
      });
    }

    const lead = await FreeConsultation.create({
      fullName,
      country,
      city,
      countryCode: countryCode || "+91",
      mobile,
      clinicalRequirement,

      // 🔥 IMPORTANT AUTO FIELDS
      source: "employee",
      assignedTo: req.employeeId,
      leadStatus: "contacted"
    });

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead
    });
  } catch (error) {
    console.error("Create Lead By Employee Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getMyLeads = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = {
      assignedTo: req.employeeId
    };

    if (status) {
      query.leadStatus = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } }
      ];
    }

    const leads = await FreeConsultation.find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: leads.length,
      data: leads
    });
  } catch (error) {
    console.error("Get My Leads Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};