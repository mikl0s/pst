# Development Plan: PST Analyzer

## Epic 1: Email Parsing and Indexing
- [x] **Story 1.1**: Create functionality to upload PST files via the web app.
- [ ] **Story 1.2**: Parse emails and extract metadata (e.g., sender, recipients, date).
- [ ] **Story 1.3**: Detect and group email chains based on headers.
- [ ] **Story 1.4**: Store email metadata and content in PostgreSQL.
- [ ] **Story 1.5**: Generate structured data for quick retrieval.

## Epic 2: Attachment Handling and OCR
- [ ] **Story 2.1**: Extract attachments from emails and store them in MinIO.
- [ ] **Story 2.2**: Preprocess PDF attachments using LLaMA 3.2 Vision for OCR.
- [ ] **Story 2.3**: Convert processed PDFs into structured formats (JSON/YAML).
- [ ] **Story 2.4**: Store structured data for attachments in PostgreSQL.

## Epic 3: Advanced Search Functionality
- [ ] **Story 3.1**: Implement full-text search for emails.
- [ ] **Story 3.2**: Enable search within attachments (e.g., PDFs).
- [ ] **Story 3.3**: Add tag-based filtering options.
- [ ] **Story 3.4**: Add advanced query filters (e.g., projects, participants).
- [ ] **Story 3.5**: Support query results export (e.g., ZIP downloads).

## Epic 4: User Interface and Experience
- [ ] **Story 4.1**: Develop a React-based web interface.
- [ ] **Story 4.2**: Design light and dark themes.
- [ ] **Story 4.3**: Add a dashboard to display parsed email summaries.
- [ ] **Story 4.4**: Implement a detailed view for individual emails and attachments.
- [ ] **Story 4.5**: Add search result visualization and navigation.

## Epic 5: AI Assistant Integration (Long-Term Goal)
- [ ] **Story 5.1**: Set up LangChain for conversational querying.
- [ ] **Story 5.2**: Define a schema for structured data input to the LLM.
- [ ] **Story 5.3**: Implement basic conversational queries for email metadata.
- [ ] **Story 5.4**: Extend AI to support queries like "Find all invoices from Company X."
- [ ] **Story 5.5**: Enable conversational file management (e.g., download or email attachments).
- [ ] **Story 5.6**: Train the assistant to refine searches iteratively.

## Epic 6: CI/CD and Deployment
- [ ] **Story 6.1**: Set up GitHub Actions for CI/CD.
- [ ] **Story 6.2**: Automate deployment of the web app backend and frontend.
- [ ] **Story 6.3**: Configure secure access to Docker containers with Tailscale.
