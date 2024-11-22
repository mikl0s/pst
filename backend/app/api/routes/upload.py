from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Depends
from typing import Dict
from ...services.storage import StorageService

router = APIRouter()

def get_storage_service():
    return StorageService()

@router.post("/upload/", 
    response_model=Dict[str, str],
    responses={
        200: {
            "description": "Successfully uploaded PST file",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "file_id": "abc123_file.pst",
                        "message": "File uploaded successfully"
                    }
                }
            }
        },
        400: {
            "description": "Invalid file type",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Invalid file type. Only .pst files are allowed."
                    }
                }
            }
        },
        400: {
            "description": "Invalid request",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "No file provided"
                    }
                }
            }
        },
        500: {
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Error uploading file"
                    }
                }
            }
        }
    }
)
async def upload_pst(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    storage_service: StorageService = Depends(get_storage_service)
) -> Dict[str, str]:
    """Upload a PST file to the storage system.
    
    This endpoint handles the upload of PST files to the MinIO storage backend.
    It performs validation on the file type and size before storing.
    
    Args:
        file (UploadFile): The PST file to be uploaded. Must be a valid PST file.
        background_tasks (BackgroundTasks, optional): FastAPI background tasks handler
            for potential async processing.
    
    Returns:
        Dict[str, str]: A dictionary containing:
            - status: "success" if upload was successful
            - file_id: The unique identifier for the uploaded file
            - message: A human-readable status message
    
    Raises:
        HTTPException(400): If no file is provided or if file type is invalid
        HTTPException(500): If there's an error during upload or processing
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")

    if not file.filename.lower().endswith('.pst'):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only .pst files are allowed."
        )

    try:
        object_name = await storage_service.upload_file(file)
        return {
            "status": "success",
            "file_id": object_name,
            "message": "File uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading file: {str(e)}"
        )
