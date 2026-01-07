# File Upload Server

A simple Node.js file upload server using Express and Multer.

## Quick Start

1. Install dependencies:
   ```bash
   make install
   ```

2. Start the server:
   ```bash
   make dev
   ```

Server will run at `http://localhost:3000`

## API Endpoints

### Upload File
- **POST** `/upload`
- **Content-Type**: `multipart/form-data`
- **Field**: `file` (accepts any file type)

**Example using curl:**
```bash
curl -X POST -F "file=@example.jpg" http://localhost:3000/upload
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "url": "/file/1704624567890.jpg",
  "filename": "1704624567890.jpg",
  "size": 2048576,
  "mimetype": "image/jpeg"
}
```

### Health Check
- **GET** `/health`

Returns server status information.

## Configuration

- Upload directory: `file/`
- File size limit: 10MB
- Port: 3000 (configurable via `PORT` environment variable)

## Project Structure

```
app/
├── config/          # Configuration
├── middleware/      # Multer upload middleware
├── routes/          # API routes
├── utils/           # File utilities
├── server.js        # Main server file
└── package.json     # Dependencies