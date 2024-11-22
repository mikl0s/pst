# PST Analyzer Backend (NestJS)

This is the NestJS-based backend for the PST Analyzer application. It provides a modern, TypeScript-first approach to handling PST file analysis.

## Features

- Full TypeScript support with strict type checking
- PostgreSQL database integration using TypeORM
- PST file parsing using pst-extractor
- RESTful API with Swagger documentation
- Efficient file handling with Node.js streams
- Comprehensive test coverage with Jest

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=pst_analyzer
NODE_ENV=development
```

3. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000` with Swagger documentation at `http://localhost:3000/api`.

## Development

- `npm run start:dev` - Start the development server with hot reload
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── pst/                    # PST module
│   ├── entities/          # Database entities
│   ├── dto/               # Data Transfer Objects
│   ├── pst.controller.ts  # REST API endpoints
│   ├── pst.service.ts     # Business logic
│   └── pst.module.ts      # Module definition
├── app.module.ts          # Root module
└── main.ts               # Application entry point
```

## API Endpoints

- `POST /pst/upload` - Upload a PST file
- `GET /pst/files` - List all uploaded PST files
- `GET /pst/files/:id` - Get details of a specific PST file
- `GET /pst/files/:id/emails` - Get emails from a PST file
- `DELETE /pst/files/:id` - Delete a PST file and its data
