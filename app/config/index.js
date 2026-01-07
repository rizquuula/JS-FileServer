const path = require('path');

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 3000,

  // Upload configuration
  UPLOAD_DIR: 'images',
  UPLOAD_PATH: path.join(__dirname, '..', 'images'),

  // Static files configuration
  STATIC_ROUTE: '/images',
  STATIC_PATH: 'images'
};