from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database
    database_url: str

    # MinIO
    minio_root_user: str
    minio_root_password: str
    minio_endpoint: str
    minio_secure: bool
    minio_bucket_name: str

    # API
    api_host: str
    api_port: int
    debug: bool

    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    return Settings()
