const fs = require('fs');
const path = require('path');

/**
 * Ensures that a directory exists, creating it if necessary
 * @param {string} dirPath - Path to the directory
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Gets the file extension from a filename
 * @param {string} filename - The filename
 * @returns {string} The file extension including the dot
 */
function getFileExtension(filename) {
  return path.extname(filename);
}

/**
 * Generates a unique filename with timestamp
 * @param {string} originalFilename - The original filename
 * @returns {string} A unique filename with timestamp
 */
function generateUniqueFilename(originalFilename) {
  const timestamp = Date.now();
  const extension = getFileExtension(originalFilename);
  return `${timestamp}${extension}`;
}

/**
 * Cleans up expired files based on TTL
 * @param {string} dirPath - Directory to clean up
 * @param {number} ttlHours - Time to live in hours
 */
function cleanupExpiredFiles(dirPath, ttlHours) {
  const fs = require('fs');
  const path = require('path');
  const now = Date.now();
  const ttlMs = ttlHours * 60 * 60 * 1000; // Convert hours to milliseconds

  try {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      // Check if file is older than TTL
      if (now - stats.mtime.getTime() > ttlMs) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up expired file: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error during file cleanup:', error);
  }
}

module.exports = {
  ensureDirectoryExists,
  getFileExtension,
  generateUniqueFilename,
  cleanupExpiredFiles
};