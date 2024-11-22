# PST Analyzer - Development Lessons

## Story 1.1: PST File Upload

### Summary
Implemented PST file upload functionality with NestJS/TypeScript backend, including file validation, storage, and database integration.

### Key Insights
- Use NestJS built-in validators (ParseFilePipe, FileTypeValidator) for robust file validation
- Implement streaming for large file uploads to manage memory efficiently
- TypeORM decorators simplify entity definitions and database operations
- Dependency injection in NestJS makes testing much easier with mocks
- Separate file storage logic from database operations for better modularity
- Use UUID for unique file naming to prevent collisions
- Handle both file system and database operations in try-catch blocks

### References
- `/backend/src/pst/pst.controller.ts` - File upload endpoint implementation
- `/backend/src/pst/pst.service.ts` - File handling and storage logic
- `/backend/src/pst/entities/pst-file.entity.ts` - Database entity definition
- `/backend/src/pst/dto/upload-pst.dto.ts` - Data transfer object

### Testing
- Mock fs/promises properly for directory creation tests
- Use Jest spies for verifying file operations
- Test both successful and error scenarios in file upload
- Separate unit tests for controller and service layers
- Mock TypeORM repository for database operation tests
- Test file validation with various file types and sizes
- Ensure proper cleanup in test teardown