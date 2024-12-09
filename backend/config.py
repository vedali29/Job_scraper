import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    WAIT_TIME = int(os.getenv('WAIT_TIME', 15))
    SCROLL_PAUSE_TIME = int(os.getenv('SCROLL_PAUSE_TIME', 2))
    MAX_RETRIES = int(os.getenv('MAX_RETRIES', 3))
