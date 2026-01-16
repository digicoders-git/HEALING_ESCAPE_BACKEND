import express from 'express'
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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

await connectDB();

app.use('/admin',adminRoute)
app.use('/speciality',specialityRouter)
app.use('/hospital',hospitalRouter)
app.use('/doctor',doctorRouter)
app.use('/blog',blogrouter)
app.use('/gallery',galleryRouter)
app.use('/video',videoRouter)


// 404 handler
app.use((req, res) =>
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));