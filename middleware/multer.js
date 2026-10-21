import multer from "multer";
import path from "path";
import fs from "fs";
import { UPLOAD_ROOT } from "../utils/fileUpload.js";

const getDestinationFolder = (req, file) => {
  const url = (req.baseUrl || req.originalUrl || "").toLowerCase();

  if (url.includes("doctor")) return "doctors";
  if (url.includes("hospital")) return "hospitals";
  if (url.includes("speciality")) return "specialities";
  if (url.includes("blog")) return "blogs";
  if (url.includes("gallery")) return "gallery";
  if (url.includes("career")) return "careers";
  if (url.includes("admin")) return "admin";
  if (url.includes("employee")) return "employees";

  if (url.includes("video")) {
    if (file.fieldname === "thumbnail") return "videos/thumbnails";
    if (file.fieldname === "video") return "videos/files";
    return "videos";
  }

  return "general";
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const folder = getDestinationFolder(req, file);
      const targetDir = path.join(UPLOAD_ROOT, folder);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      cb(null, targetDir);
    } catch (err) {
      cb(err, UPLOAD_ROOT);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${cleanName || "file"}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB Limit (allows video uploads)
    fieldSize: 50 * 1024 * 1024   // 50MB Limit for text fields
  }
});

export default upload;
