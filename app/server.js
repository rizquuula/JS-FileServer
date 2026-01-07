const express = require('express');
const config = require('./config');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from images directory
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
});

module.exports = app;