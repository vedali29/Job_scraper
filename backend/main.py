from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from scraper import WellfoundScraper
from config import settings
import logging
import traceback
from mock_data import MOCK_JOBS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = FastAPI(title="Wellfound Job Scraper")

# Updated CORS middleware with environment-based origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class JobSearchRequest(BaseModel):
    keywords: List[str]
    max_jobs_per_keyword: int = 10


@app.post("/scrape-jobs")
async def scrape_jobs(request: JobSearchRequest):
    scraper = None
    try:
        logging.info(f"Received search request for keywords: {request.keywords}")
        
        if not request.keywords:
            raise HTTPException(status_code=400, detail="No keywords provided")
            
        # Try scraping first
        scraper = WellfoundScraper()
        jobs = scraper.scrape_jobs(request.keywords, request.max_jobs_per_keyword)
        
        # If scraping fails or returns no jobs, use mock data
        if not jobs:
            logging.info("Using mock data as fallback")
            # Filter mock data based on keywords
            jobs = [
                job for job in MOCK_JOBS 
                if any(keyword.lower() in job['title'].lower() for keyword in request.keywords)
            ][:request.max_jobs_per_keyword]
        
        companies_by_keyword = {}
        for job in jobs:
            keyword = job['keyword']
            if keyword not in companies_by_keyword:
                companies_by_keyword[keyword] = set()
            companies_by_keyword[keyword].add(job['company'])
        
        result = {
            "status": "success",
            "jobs": jobs,
            "total_jobs": len(jobs),
            "companies_by_keyword": {
                keyword: list(companies) 
                for keyword, companies in companies_by_keyword.items()
            }
        }
        
        return result
        
    except Exception as e:
        logging.error(f"Error during job scraping: {str(e)}")
        # Return mock data on error
        return {
            "status": "success",
            "jobs": MOCK_JOBS[:request.max_jobs_per_keyword],
            "total_jobs": len(MOCK_JOBS),
            "companies_by_keyword": {"default": list(set(job['company'] for job in MOCK_JOBS))}
        }
    finally:
        if scraper:
            scraper.close()

@app.get("/")
async def root():
    return {"message": "Wellfound Job Scraper API"}
