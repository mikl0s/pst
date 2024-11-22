# PST Analyzer

A web application for analyzing PST (Personal Storage Table) files, with features for email parsing, attachment management, and advanced search capabilities.

## Features

- Upload and process PST files
- Extract email metadata and content
- Manage email attachments
- Advanced search functionality
- Modern web interface with Material-UI

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- MinIO

## Setup

### Backend Setup

1. Create a virtual environment and activate it:
```bash
python -m venv venv
.\venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and configure your environment variables:
```bash
cp .env.example .env
```

4. Start the backend server:
```bash
uvicorn backend.app.main:app --reload
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

Run the tests using pytest:
```bash
# Activate virtual environment first
.\venv\Scripts\activate  # Windows

# Run all tests
pytest

# Run specific test file
pytest backend/app/tests/test_upload.py

# Run tests with coverage report
pytest --cov=app
```

The test suite includes:
- Unit tests for API endpoints
- Integration tests for file uploads
- Mocked external dependencies (MinIO)
- Comprehensive error handling tests

## Development

- Backend API runs on `http://localhost:8000`
- Frontend development server runs on `http://localhost:3000`
- API documentation available at `http://localhost:8000/docs`

## Project Structure

```
PST Analyzer/
├── backend/
│   └── app/
│       ├── api/
│       │   └── routes/
│       │       └── upload.py
│       ├── core/
│       │   ├── config.py
│       │   └── security.py
│       ├── services/
│       │   └── storage.py
│       └── main.py
├── frontend/
│   └── src/
│       ├── components/
│       │   └── upload/
│       │       └── FileUpload.tsx
│       └── App.tsx
├── requirements.txt
└── .env.example
