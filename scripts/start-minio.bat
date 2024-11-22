@echo off
REM Create data directory if it doesn't exist
mkdir data 2>nul

REM Start MinIO server
minio.exe server data --console-address :9001
