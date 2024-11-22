import pytest
from fastapi.testclient import TestClient
from app.services.storage import StorageService
from minio import Minio
from app.core.config import Settings

@pytest.fixture(autouse=True)
def mock_settings(mocker):
    """Mock settings to prevent actual MinIO connection during import."""
    mock_settings = Settings(
        minio_endpoint="localhost:9000",
        minio_root_user="test",
        minio_root_password="test",
        minio_bucket_name="test-bucket",
        minio_secure=False
    )
    mocker.patch("app.services.storage.get_settings", return_value=mock_settings)
    mocker.patch("app.core.config.get_settings", return_value=mock_settings)
    return mock_settings

@pytest.fixture(autouse=True)
def mock_minio_client(mocker):
    """Mock MinIO client to prevent actual connections during tests."""
    mock_client = mocker.Mock(spec=Minio)
    mock_client.bucket_exists.return_value = True
    mocker.patch("app.services.storage.Minio", return_value=mock_client)
    return mock_client

@pytest.fixture
def test_client():
    """Create a test client for the FastAPI application."""
    from app.main import app  # Import here after mocks are in place
    return TestClient(app)

@pytest.fixture
def mock_storage_service(mocker):
    """Create a mock storage service using pytest-mock."""
    mock_service = mocker.Mock(spec=StorageService)
    mock_service.upload_file.return_value = "test_object_name"
    mocker.patch("app.api.routes.upload.storage_service", mock_service)
    return mock_service
