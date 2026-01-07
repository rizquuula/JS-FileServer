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
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;

  try {
    if (!req.file) {
      console.log(`[${timestamp}] UPLOAD FAILED - ${ip} - No file provided`);
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please provide a file via multipart/form-data'
      });
    }

    console.log(`[${timestamp}] UPLOAD SUCCESS - ${ip} - ${req.file.filename} (${req.file.size} bytes)`);

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
    console.error(`[${timestamp}] UPLOAD ERROR - ${ip} - ${error.message}`);
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
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;

  try {
    const { base64, filename = 'file' } = req.body;

    if (!base64) {
      console.log(`[${timestamp}] BASE64 UPLOAD FAILED - ${ip} - No base64 data provided`);
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Base64 data is required'
      });
    }

    let base64Data = base64;
    let mimetype = 'application/octet-stream';

    // Check if it's a data URL (e.g., data:image/png;base64,...)
    if (base64.startsWith('data:')) {
      const dataUrlMatch = base64.match(/^data:([^;]+);base64,(.+)$/);
      if (!dataUrlMatch) {
        console.log(`[${timestamp}] BASE64 UPLOAD FAILED - ${ip} - Invalid data URL format`);
        return res.status(400).json({
          error: 'Invalid data URL',
          message: 'The provided data URL is not in the correct format'
        });
      }
      mimetype = dataUrlMatch[1]; // Extract MIME type
      base64Data = dataUrlMatch[2]; // Extract base64 data
    }

    // Decode base64 data
    const buffer = Buffer.from(base64Data, 'base64');
    console.log(`[${timestamp}] BASE64 DECODE - ${ip} - Decoded ${buffer.length} bytes from base64`);

    // Adjust filename extension based on MIME type if no extension provided
    let adjustedFilename = filename;
    if (!path.extname(filename)) {
      const mimeToExt = {
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/svg+xml': '.svg'
      };
      if (mimeToExt[mimetype]) {
        adjustedFilename += mimeToExt[mimetype];
      }
    }

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(adjustedFilename);

    // Ensure upload directory exists
    ensureDirectoryExists(config.UPLOAD_PATH);

    // Save file
    const filePath = path.join(config.UPLOAD_PATH, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    // Get file stats
    const stats = fs.statSync(filePath);

    console.log(`[${timestamp}] BASE64 UPLOAD SUCCESS - ${ip} - ${uniqueFilename} (${stats.size} bytes)`);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      url: `${config.STATIC_ROUTE}/${uniqueFilename}`,
      filename: uniqueFilename,
      size: stats.size,
      mimetype: mimetype
    });
  } catch (error) {
    console.error(`[${timestamp}] BASE64 UPLOAD ERROR - ${ip} - ${error.message}`);
    res.status(500).json({
      error: 'Upload failed',
      message: 'An error occurred while processing base64 upload'
    });
  }
}

module.exports = router;