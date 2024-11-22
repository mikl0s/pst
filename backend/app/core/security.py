import os
from typing import List
from fastapi import UploadFile

ALLOWED_EXTENSIONS = {'.pst'}
MAX_FILE_SIZE = 1024 * 1024 * 1024 * 10  # 10GB

class SecurityValidator:
    @staticmethod
    def validate_file_extension(filename: str) -> bool:
        return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS

    @staticmethod
    def validate_file_size(file: UploadFile) -> bool:
        try:
            file.file.seek(0, 2)  # Seek to end of file
            size = file.file.tell()
            file.file.seek(0)  # Reset file pointer
            return size <= MAX_FILE_SIZE
        except Exception:
            return False

    @staticmethod
    def sanitize_filename(filename: str) -> str:
        # Remove potentially dangerous characters
        return ''.join(c for c in filename if c.isalnum() or c in '._-')
