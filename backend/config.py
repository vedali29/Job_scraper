from pydantic import BaseSettings
from typing import List

class Settings(BaseSettings):
    WAIT_TIME: int = 15
    SCROLL_PAUSE_TIME: int = 2
    MAX_RETRIES: int = 3
    ENVIRONMENT: str = "development"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://scrapthe-job.netlify.app"
    ]

    class Config:
        env_file = ".env"

settings = Settings()
