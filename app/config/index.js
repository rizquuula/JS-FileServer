const path = require('path');

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 3000,

  // Upload configuration
  UPLOAD_DIR: 'file',
  UPLOAD_PATH: path.join(__dirname, '..', 'file'),
  FILE_SIZE_LIMIT: 10 * 1024 * 1024, // 10MB

  // Static files configuration
  STATIC_ROUTE: '/file',
  STATIC_PATH: 'file'
};