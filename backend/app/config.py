import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env if present
env_path = BASE_DIR / '.env'
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv('DATABASE_URL', f"sqlite:///{BASE_DIR / 'nutri.db'}")
JWT_SECRET = os.getenv('JWT_SECRET', 'change_this_secret')
AI_API_KEY = os.getenv('AI_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
VISION_API_KEY = os.getenv('VISION_API_KEY')
FOOD_API_KEY = os.getenv('FOOD_API_KEY')
