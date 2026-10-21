import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const UPLOAD_ROOT = path.resolve(__dirname, "../uploads");

// Ensure upload root exists
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

/**
 * Returns the relative path from the uploads directory.
 * e.g. "employees/photo-1718000.jpg"
 */
export const getFilePublicId = (file) => {
  if (!file || !file.path) return "";
  return path.relative(UPLOAD_ROOT, file.path).replace(/\\/g, "/");
};

/**
 * Returns the full accessible URL for the uploaded file.
 * e.g. "http://localhost:7676/uploads/employees/photo-1718000.jpg"
 */
export const getFileUrl = (req, file) => {
  if (!file) return "";
  const relativePath = getFilePublicId(file);
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${relativePath}`;
};

/**
 * Safely deletes a file from the uploads directory.
 * Accepts full URL, relative path, or publicId.
 */
export const deleteUploadedFile = (filePathOrUrl) => {
  if (!filePathOrUrl || typeof filePathOrUrl !== "string") return;

  try {
    let cleanPath = filePathOrUrl.trim();

    // If it's a full URL, extract path
    if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
      try {
        const urlObj = new URL(cleanPath);
        cleanPath = urlObj.pathname; // e.g. "/uploads/employees/photo-123.jpg"
      } catch {
        // Not a standard URL, continue
      }
    }

    // Match uploads/path or just path
    const match = cleanPath.match(/(?:^|\/)uploads\/(.+)$/);
    const subPath = match ? match[1] : cleanPath;

    // Guard against path traversal
    const safeSubPath = path.normalize(subPath).replace(/^(\.\.[\/\\])+/, "");
    const fullPath = path.join(UPLOAD_ROOT, safeSubPath);

    // Only delete if inside UPLOAD_ROOT and exists
    if (fullPath.startsWith(UPLOAD_ROOT) && fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      if (stat.isFile()) {
        fs.unlinkSync(fullPath);
      }
    }
  } catch (error) {
    console.error("Failed to delete local uploaded file:", error.message);
  }
};
