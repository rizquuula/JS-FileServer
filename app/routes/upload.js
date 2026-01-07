const express = require('express');
const upload = require('../middleware/upload');
const config = require('../config');

const router = express.Router();

/**
 * POST /upload
 * Upload a single image file
 */
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a file to upload'
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

module.exports = router;