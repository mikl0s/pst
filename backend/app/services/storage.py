from minio import Minio
from minio.error import S3Error
from fastapi import UploadFile, HTTPException
import os
from typing import Optional
from ..core.config import get_settings
from ..core.security import SecurityValidator

settings = get_settings()

class StorageService:
    """Service for handling file storage operations using MinIO.
    
    This service manages file uploads to MinIO, including validation
    and secure storage of files. It ensures proper bucket initialization
    and handles file upload operations with proper error handling.
    """

    def __init__(self) -> None:
        """Initialize the StorageService with MinIO client configuration."""
        self.client = Minio(
            settings.minio_endpoint,
            access_key=settings.minio_root_user,
            secret_key=settings.minio_root_password,
            secure=settings.minio_secure
        )
        self._ensure_bucket_exists()

    def _ensure_bucket_exists(self) -> None:
        """Ensure the required MinIO bucket exists.
        
        Creates the bucket if it doesn't exist.
        
        Raises:
            HTTPException: If bucket creation fails
        """
        try:
            if not self.client.bucket_exists(settings.minio_bucket_name):
                self.client.make_bucket(settings.minio_bucket_name)
        except S3Error as e:
            raise HTTPException(status_code=500, detail=f"Storage initialization failed: {str(e)}")

    async def upload_file(self, file: UploadFile) -> str:
        """Upload a file to MinIO storage.
        
        Args:
            file (UploadFile): The file to upload, must be a PST file
        
        Returns:
            str: The unique object name of the uploaded file
        
        Raises:
            HTTPException: If file validation fails or upload errors occur
        """
        try:
            # Validate file
            if not SecurityValidator.validate_file_extension(file.filename):
                raise HTTPException(status_code=400, detail="Invalid file type. Only .pst files are allowed.")
            
            if not SecurityValidator.validate_file_size(file):
                raise HTTPException(status_code=400, detail="File size exceeds maximum limit.")

            # Sanitize filename
            safe_filename = SecurityValidator.sanitize_filename(file.filename)
            
            # Generate unique object name
            object_name = f"{os.urandom(8).hex()}_{safe_filename}"

            # Upload file
            file_size = 0
            file.file.seek(0, 2)
            file_size = file.file.tell()
            file.file.seek(0)

            self.client.put_object(
                bucket_name=settings.minio_bucket_name,
                object_name=object_name,
                data=file.file,
                length=file_size
            )

            return object_name

        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

    async def get_file_url(self, object_name: str) -> str:
        """Get a presigned URL for a file in MinIO storage.
        
        Args:
            object_name (str): The name of the object in MinIO storage
        
        Returns:
            str: A presigned URL for the file
        
        Raises:
            HTTPException: If the file is not found
        """
        try:
            return self.client.presigned_get_object(
                bucket_name=settings.minio_bucket_name,
                object_name=object_name,
                expires=3600  # URL expires in 1 hour
            )
        except S3Error as e:
            raise HTTPException(status_code=404, detail=f"File not found: {str(e)}")
