from fastapi import FastAPI, APIRouter, File, UploadFile
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import base64
from io import BytesIO
from PIL import Image, ImageEnhance, ImageFilter
import cv2
import numpy as np


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ImageProject(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    original_image: str  # base64
    edited_image: Optional[str] = None  # base64
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    filters_applied: List[str] = []

class ApplyFilterRequest(BaseModel):
    image_base64: str
    filter_type: str
    intensity: float = 1.0

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {'_id': 1, 'client_name': 1, 'timestamp': 1}).to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/apply-filter")
async def apply_filter(request: ApplyFilterRequest):
    """Apply advanced filters to an image using PIL and OpenCV"""
    try:
        # Decode base64 image
        image_data = base64.b64decode(request.image_base64)
        image = Image.open(BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Apply filter based on type
        if request.filter_type == 'vintage':
            # Apply vintage effect
            enhancer = ImageEnhance.Color(image)
            image = enhancer.enhance(0.7)
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(1.2)
            # Add sepia tone
            image = image.convert('RGB')
            pixels = image.load()
            for y in range(image.size[1]):
                for x in range(image.size[0]):
                    r, g, b = pixels[x, y]
                    tr = int(0.393 * r + 0.769 * g + 0.189 * b)
                    tg = int(0.349 * r + 0.686 * g + 0.168 * b)
                    tb = int(0.272 * r + 0.534 * g + 0.131 * b)
                    pixels[x, y] = (min(tr, 255), min(tg, 255), min(tb, 255))
        
        elif request.filter_type == 'warm':
            # Warm tone
            enhancer = ImageEnhance.Color(image)
            image = enhancer.enhance(1.2)
            # Increase red/yellow
            np_image = np.array(image)
            np_image[:, :, 0] = np.clip(np_image[:, :, 0] * 1.1, 0, 255)  # Red
            np_image[:, :, 1] = np.clip(np_image[:, :, 1] * 1.05, 0, 255)  # Green
            image = Image.fromarray(np_image.astype('uint8'))
        
        elif request.filter_type == 'cool':
            # Cool tone
            np_image = np.array(image)
            np_image[:, :, 2] = np.clip(np_image[:, :, 2] * 1.1, 0, 255)  # Blue
            np_image[:, :, 0] = np.clip(np_image[:, :, 0] * 0.95, 0, 255)  # Red
            image = Image.fromarray(np_image.astype('uint8'))
        
        elif request.filter_type == 'sharp':
            image = image.filter(ImageFilter.SHARPEN)
        
        elif request.filter_type == 'smooth':
            image = image.filter(ImageFilter.SMOOTH)
        
        # Convert back to base64
        buffered = BytesIO()
        image.save(buffered, format="JPEG", quality=95)
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return {
            "success": True,
            "image_base64": img_str,
            "filter_applied": request.filter_type
        }
    
    except Exception as e:
        logger.error(f"Error applying filter: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

@api_router.post("/save-project")
async def save_project(project: ImageProject):
    """Save an image editing project to database"""
    try:
        project_dict = project.dict()
        result = await db.projects.insert_one(project_dict)
        return {
            "success": True,
            "project_id": project.id
        }
    except Exception as e:
        logger.error(f"Error saving project: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

@api_router.get("/projects")
async def get_projects():
    """Get all saved projects (metadata only, excludes large image data)"""
    try:
        # Exclude large base64 image fields for better performance
        projects = await db.projects.find(
            {},
            {'original_image': 0, 'edited_image': 0}
        ).sort("timestamp", -1).to_list(100)
        return {
            "success": True,
            "projects": projects
        }
    except Exception as e:
        logger.error(f"Error getting projects: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
