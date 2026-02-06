import express from 'express'
import multer from 'multer';
import connectDB from './config/db.js';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { adminRoute } from './routes/admin.route.js';
import specialityRouter from './routes/speciality.routes.js';
import hospitalRouter from './routes/hospital.routes.js';
import doctorRouter from './routes/doctor.routes.js';
import blogrouter from './routes/blog.routes.js';
import galleryRouter from './routes/gallery.routes.js';
import videoRouter from './routes/video.routes.js';
import freeConsultationRouter from './routes/freeConsultation.routes.js';
import enquiryRouter from './routes/enquiry.routes.js';
import employeeRouter from './routes/CRM/employee.routes.js';
import leadAssignRoute from './routes/CRM/leadAssign.routes.js';
import followUpRouter from './routes/CRM/followUp.routes.js';
import employeeDashboardRouter from './routes/CRM/employeeDashboard.routes.js';
import employeeAuthRouter from './routes/employee_CRM/employeeAuth.routes.js';
dotenv.config()

const app = express()
const port = process.env.PORT || 3000
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDB();

// app.get('/', (req, res) => {
//   res.status(200).json({message:"APIs is running successfully , You are genious! "})
// })

app.use('/admin', adminRoute)
app.use('/speciality', specialityRouter)
app.use('/hospital', hospitalRouter)
app.use('/doctor', doctorRouter)
app.use('/blog', blogrouter)
app.use('/gallery', galleryRouter)
app.use('/video', videoRouter)
app.use('/free-consultation', freeConsultationRouter)
app.use('/enquiry', enquiryRouter)

app.use('/employee', employeeRouter)
app.use('/lead', leadAssignRoute)
app.use('/followup', followUpRouter)
// app.use('/employee', employeeDashboardRouter)
app.use('/employeeCRM', employeeAuthRouter)

// 404 handler
app.use((req, res) =>
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "File is too large. Maximum limit is 10MB." });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
  next();
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));