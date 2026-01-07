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

module.exports = {
  ensureDirectoryExists,
  getFileExtension,
  generateUniqueFilename
};