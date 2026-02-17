import multer from "multer";

const storage = multer.diskStorage({});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB Limit for files
    fieldSize: 50 * 1024 * 1024  // 50MB Limit for text fields (like blog content with Base64 images)
  }
});

export default upload;
