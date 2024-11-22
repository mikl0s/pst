import pytest
from fastapi.testclient import TestClient
import sys
import os
import io

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.main import app
from app.services.storage import StorageService
from app.api.routes.upload import get_storage_service
from unittest.mock import Mock, patch

pytestmark = [pytest.mark.asyncio, pytest.mark.upload]

def get_test_storage_service():
    mock_service = Mock(spec=StorageService)
    mock_service.upload_file.return_value = "test_object_name"
    return mock_service

@pytest.fixture
def test_client():
    app.dependency_overrides[get_storage_service] = get_test_storage_service
    client = TestClient(app)
    yield client
    app.dependency_overrides = {}

async def test_upload_valid_pst_file(test_client):
    """Test successful upload of a valid PST file."""
    # Create a mock file
    file_content = b"mock pst file content"
    mock_file = io.BytesIO(file_content)
    
    # Make the request
    response = test_client.post(
        "/api/upload/",
        files={"file": ("test.pst", mock_file, "application/octet-stream")}
    )
    
    # Assert response
    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "file_id": "test_object_name",
        "message": "File uploaded successfully"
    }

async def test_upload_invalid_file_type(test_client):
    """Test rejection of non-PST files."""
    # Create a mock file with wrong extension
    file_content = b"mock file content"
    mock_file = io.BytesIO(file_content)
    
    # Make the request
    response = test_client.post(
        "/api/upload/",
        files={"file": ("test.txt", mock_file, "text/plain")}
    )
    
    # Assert response
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]

async def test_upload_no_file(test_client):
    """Test error handling when no file is provided."""
    # Make request without file
    response = test_client.post("/api/upload/")
    
    # Assert response
    assert response.status_code == 422  # FastAPI's validation error code
    assert "field required" in response.json()["detail"][0]["msg"].lower()

async def test_upload_storage_error(test_client):
    """Test handling of storage service errors."""
    # Create a mock service that raises an error
    mock_service = Mock(spec=StorageService)
    mock_service.upload_file.side_effect = Exception("Storage error")
    app.dependency_overrides[get_storage_service] = lambda: mock_service
    
    # Create mock file
    file_content = b"mock pst file content"
    mock_file = io.BytesIO(file_content)
    
    # Make the request
    response = test_client.post(
        "/api/upload/",
        files={"file": ("test.pst", mock_file, "application/octet-stream")}
    )
    
    # Assert response
    assert response.status_code == 500
    assert "Storage error" in response.json()["detail"]
