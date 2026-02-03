import mongoose from "mongoose";
import FollowUp from "../../model/CRM/followUp.model.js";
import freeConsultationModel from "../../model/freeConsultation.model.js";

/* =========================
   EMPLOYEE DASHBOARD
========================= */
export const getEmployeeDashboard = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const totalLeadsCount = await freeConsultationModel.countDocuments({
      assignedTo: employeeId
    });

    const closedLeadsCount = await freeConsultationModel.countDocuments({
      assignedTo: employeeId,
      leadStatus: "closed"
    });

    const todayFollowUpsList = await FollowUp.find({
      employee: employeeId,
      nextFollowUpDate: { $lte: today },
      status: "pending"
    })
      .populate("lead", "fullName mobile city")
      .sort({ nextFollowUpDate: 1 });

    const upcomingFollowUpsList = await FollowUp.find({
      employee: employeeId,
      nextFollowUpDate: { $gt: today },
      status: "pending"
    })
      .populate("lead", "fullName mobile city")
      .sort({ nextFollowUpDate: 1 });

    const getGraphData = async (match, groupFormat) => {
      return await freeConsultationModel.aggregate([
        { $match: match },
        {
          $group: {
            _id: groupFormat,
            leads: { $sum: 1 },
            closed: { $sum: { $cond: [{ $eq: ["$leadStatus", "closed"] }, 1, 0] } }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
      ]);
    };

    const periodMatch = { assignedTo: new mongoose.Types.ObjectId(employeeId) };
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // 1. Daily (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const dailyRaw = await getGraphData(
      { ...periodMatch, createdAt: { $gte: sevenDaysAgo } },
      { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } }
    );

    const daily = { labels: [], leads: [], closed: [] };
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = `${d.getDate()} ${months[d.getMonth()]}`;
      const found = dailyRaw.find(r => r._id.day === d.getDate() && r._id.month === (d.getMonth() + 1));
      daily.labels.push(label);
      daily.leads.push(found ? found.leads : 0);
      daily.closed.push(found ? found.closed : 0);
    }

    // 2. Weekly (Last 8 Weeks)
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);
    const weeklyRaw = await getGraphData(
      { ...periodMatch, createdAt: { $gte: eightWeeksAgo } },
      { year: { $year: "$createdAt" }, week: { $week: "$createdAt" } }
    );

    const weekly = { labels: [], leads: [], closed: [] };
    for (let i = 7; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - (i * 7));
      weekly.labels.push(`W-${7 - i + 1}`);
      const weekNum = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
      const found = weeklyRaw.find(r => (r._id.week === weekNum || r._id.week === weekNum + 1) && r._id.year === d.getFullYear());
      weekly.leads.push(found ? found.leads : 0);
      weekly.closed.push(found ? found.closed : 0);
    }

    // 3. Yearly (Last 12 Months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    const yearlyRaw = await getGraphData(
      { ...periodMatch, createdAt: { $gte: twelveMonthsAgo } },
      { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }
    );

    const yearly = { labels: [], leads: [], closed: [] };
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = `${months[d.getMonth()]} ${d.getFullYear() % 100}`;
      const found = yearlyRaw.find(r => r._id.month === (d.getMonth() + 1) && r._id.year === d.getFullYear());
      yearly.labels.push(label);
      yearly.leads.push(found ? found.leads : 0);
      yearly.closed.push(found ? found.closed : 0);
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalLeads: totalLeadsCount,
        closedLeads: closedLeadsCount,
        todayFollowUps: todayFollowUpsList.length,
        upcomingFollowUps: upcomingFollowUpsList.length
      },
      graphData: { daily, weekly, yearly },
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
