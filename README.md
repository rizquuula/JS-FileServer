# File Upload Server

A simple Node.js file upload server using Express and Multer with CORS enabled for web applications.

## Quick Start

### Development (Local)

1. Install dependencies:
   ```bash
   make install
   ```

2. Start the server:
   ```bash
   make dev
   ```

Server will run at `http://localhost:3000`

### Docker

1. Build and run with Docker Compose:
   ```bash
   docker compose up --build
   ```

Server will run at `http://localhost:8020`

To run in background:
```bash
docker compose up -d --build
```

## API Endpoints

### Upload File
- **POST** `/upload`
- **Content-Type**: `multipart/form-data`
- **Field**: `file` (accepts any file type)

**Example using curl:**
```bash
curl -X POST -F "file=@example.jpg" http://localhost:3000/upload
```

### Upload Base64
- **POST** `/upload/base64`
- **Content-Type**: `application/json`
- **Body**: `{"base64": "base64-encoded-file-data", "filename": "optional-filename"}`

**Example using curl:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "filename": "example.png"}' \
  http://localhost:3000/upload/base64
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "url": "/file/example-uuid-here.jpg",
  "filename": "example-uuid-here.jpg",
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
- File TTL: 24 hours (configurable via `FILE_TTL_HOURS` environment variable)
- Cleanup interval: 60 minutes (configurable via `CLEANUP_INTERVAL_MINUTES` environment variable)
- Port: 3000 (configurable via `PORT` environment variable)

## File Cleanup

Uploaded files are automatically deleted after the configured TTL (Time To Live).

**Cleanup Schedule:**
- **On startup**: Cleans up any expired files immediately when server starts
- **Periodic**: Runs every N minutes (configurable via `CLEANUP_INTERVAL_MINUTES`, default: 60 minutes)

You can change the TTL by setting the `FILE_TTL_HOURS` environment variable (default: 24 hours).

## Project Structure

```
app/
├── config/          # Configuration
├── middleware/      # Multer upload middleware
├── routes/          # API routes
├── utils/           # File utilities
├── server.js        # Main server file
└── package.json     # Dependencies