const express = require('express');
const config = require('./config');
const uploadRoutes = require('./routes/upload');
const { cleanupExpiredFiles } = require('./utils/fileUtils');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  console.error('Unhandled error:', error);

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'File size exceeds the maximum allowed limit'
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server'
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
app.listen(config.PORT, () => {
  console.log(`Server running at http://localhost:${config.PORT}`);
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