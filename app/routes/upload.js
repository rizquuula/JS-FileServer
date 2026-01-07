const express = require('express');
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upload');
const config = require('../config');
const { generateUniqueFilename, ensureDirectoryExists } = require('../utils/fileUtils');

const router = express.Router();

/**
 * POST /upload
 * Upload a single file via multipart/form-data
 */
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please provide a file via multipart/form-data'
      });
    }

    // Return success response with file information
    res.json({
      success: true,
      message: 'File uploaded successfully',
      url: `${config.STATIC_ROUTE}/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'An error occurred while uploading the file'
    });
  }
});

/**
 * POST /upload/base64
 * Upload a file via base64 JSON
 */
router.post('/upload/base64', express.json(), (req, res) => {
  handleBase64Upload(req, res);
});

/**
 * Handle base64 encoded file upload
 */
function handleBase64Upload(req, res) {
  try {
    const { base64, filename = 'file' } = req.body;

    if (!base64) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Base64 data is required'
      });
    }

    // Decode base64 data
    const buffer = Buffer.from(base64, 'base64');

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(filename);

    // Ensure upload directory exists
    ensureDirectoryExists(config.UPLOAD_PATH);

    // Save file
    const filePath = path.join(config.UPLOAD_PATH, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    // Get file stats
    const stats = fs.statSync(filePath);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      url: `${config.STATIC_ROUTE}/${uniqueFilename}`,
      filename: uniqueFilename,
      size: stats.size,
      mimetype: 'application/octet-stream' // Could be improved with proper MIME type detection
    });
  } catch (error) {
    console.error('Base64 upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'An error occurred while processing base64 upload'
    });
  }
}

module.exports = router;