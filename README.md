# PST Analyzer

A web application for analyzing PST (Personal Storage Table) files, with features for email parsing, attachment management, and advanced search capabilities.

## Features

- Upload and process PST files (up to 1GB)
- Extract email metadata and content
- Manage email attachments
- Advanced search functionality
- Modern web interface with Material-UI

## Prerequisites

- Node.js 16+
- PostgreSQL 14+
- TypeScript 5+
- NestJS 10+

## Setup

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Copy `.env.example` to `.env` and configure your environment variables:
```bash
cp .env.example .env
```

3. Start the backend server:
```bash
npm run start:dev
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

### MinIO Setup

1. Download and install MinIO
2. Configure MinIO credentials in `.env`
3. Start MinIO server

## Testing

### Backend Tests

Run the tests using Jest:
```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- backend/app/tests/test_upload.test.ts

# Run tests with coverage report
npm run test:coverage
```

The test suite includes:
- Unit tests for API endpoints
- Integration tests for file uploads
- Mocked external dependencies (MinIO)
- Comprehensive error handling tests

## Development

- Backend API runs on `http://localhost:3000`
- Frontend development server runs on `http://localhost:3001`
- API documentation available at `http://localhost:3000/docs`

## Project Structure

```
PST Analyzer/
├── backend/
│   └── app/
│       ├── api/
│       │   └── routes/
│       │       └── upload.controller.ts
│       ├── core/
│       │   ├── config.ts
│       │   └── security.ts
│       ├── services/
│       │   └── storage.service.ts
│       └── main.ts
├── frontend/
│   └── src/
│       ├── components/
│       │   └── upload/
│       │       └── FileUpload.tsx
│       └── App.tsx
├── .env.example
