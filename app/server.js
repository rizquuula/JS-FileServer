const express = require('express');
const cors = require('cors');
const config = require('./config');
const uploadRoutes = require('./routes/upload');
const { cleanupExpiredFiles } = require('./utils/fileUtils');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Increased limit for large form data

// Serve static files from file directory
app.use(config.STATIC_ROUTE, express.static(config.STATIC_PATH));

// Routes
app.use('/', uploadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'File upload server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  // Log detailed error information
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  console.error(`[${timestamp}] ERROR - ${method} ${url} - IP: ${ip}`);
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    code: error.code,
    stack: error.stack?.split('\n')[0] // First line of stack trace
  });

  // Handle specific error types
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: `File size exceeds the maximum allowed limit of ${config.FILE_SIZE_LIMIT / (1024 * 1024)}MB`
    });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Request too large',
      message: 'Request payload exceeds size limit. Try uploading smaller files or use multipart/form-data for large files.'
    });
  }

  if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON'
    });
  }

  // Generic error response
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server. Check server logs for details.'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(config.PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${config.PORT}`);
  console.log(`Upload directory: ${config.UPLOAD_DIR}`);
  console.log(`Static files served at: ${config.STATIC_ROUTE}`);
  console.log(`File TTL: ${config.FILE_TTL_HOURS} hours`);

  // Cleanup expired files on startup
  cleanupExpiredFiles(config.UPLOAD_PATH, config.FILE_TTL_HOURS);

  // Set up periodic cleanup
  const CLEANUP_INTERVAL = config.CLEANUP_INTERVAL_MINUTES * 60 * 1000; // Convert minutes to milliseconds
  setInterval(() => {
    console.log(`Running scheduled file cleanup (every ${config.CLEANUP_INTERVAL_MINUTES} minutes)...`);
    cleanupExpiredFiles(config.UPLOAD_PATH, config.FILE_TTL_HOURS);
  }, CLEANUP_INTERVAL);
});

module.exports = app;