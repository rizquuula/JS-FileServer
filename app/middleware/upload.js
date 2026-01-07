const multer = require('multer');
const path = require('path');
const config = require('../config');
const { ensureDirectoryExists, generateUniqueFilename } = require('../utils/fileUtils');

// Ensure upload directory exists
ensureDirectoryExists(config.UPLOAD_PATH);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = generateUniqueFilename(file.originalname);
    cb(null, uniqueFilename);
  }
});

// File filter (optional - can be extended for specific file types)
const fileFilter = (req, file, cb) => {
  // Accept all files for now, but can be restricted to images only
  cb(null, true);
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;