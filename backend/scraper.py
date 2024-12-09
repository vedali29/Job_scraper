import logging
import time
from typing import List, Dict, Optional
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from retrying import retry
from config import settings

class WellfoundScraper:
    def __init__(self):
        self.driver = None
        self.BASE_URL = "https://wellfound.com"
        self.SCROLL_PAUSE_TIME = settings.SCROLL_PAUSE_TIME
        self.MAX_RETRIES = settings.MAX_RETRIES


    def create_driver(self):
        """Create and configure Chrome WebDriver"""
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        
        driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
        driver.implicitly_wait(10)
        return driver

    def close(self):
        """Clean up WebDriver resources"""
        if self.driver:
            self.driver.quit()
            self.driver = None

    @retry(stop_max_attempt_number=3, wait_fixed=2000)
    def _scroll_page(self):
        """Scroll page to load all job listings"""
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        while True:
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(self.SCROLL_PAUSE_TIME)
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

    def scrape_jobs(self, keywords: List[str], max_jobs_per_keyword: int = 10) -> List[Dict]:
        """Main method to scrape jobs for multiple keywords"""
        all_jobs = []
        try:
            if not self.driver:
                self.driver = self.create_driver()
            
            for keyword in keywords:
                jobs = self.scrape_jobs_for_keyword(keyword, max_jobs_per_keyword)
                all_jobs.extend(jobs)
            
            return all_jobs
        except Exception as e:
            logging.error(f"Error in scrape_jobs: {str(e)}")
            return []
        finally:
            self.close()

    def scrape_jobs_for_keyword(self, keyword: str, max_jobs: int = 10) -> List[Dict]:
        """Scrape jobs for a specific keyword"""
        try:
            search_url = f"{self.BASE_URL}/search?q={keyword}&remote=true"
            logging.info(f"Searching jobs for keyword: {keyword}")
            
            self.driver.get(search_url)
            
            # Wait for job cards to load
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div.job-card"))
            )
            
            self._scroll_page()
            
            job_cards = self.driver.find_elements(By.CSS_SELECTOR, "div.job-card")
            jobs = []
            
            # Add this debugging section
            first_card = job_cards[0] if job_cards else None
            if first_card:
               logging.info("HTML of first job card:")
               logging.info(first_card.get_attribute('outerHTML'))
            
            for card in job_cards[:max_jobs]:
                job_data = self._extract_job_data(card, keyword)
                if job_data:
                    jobs.append(job_data)
            
            return jobs
        except Exception as e:
            logging.error(f"Error scraping jobs for {keyword}: {str(e)}")
            return []

    def _extract_job_data(self, card, keyword: str) -> Optional[Dict]:
        """Extract data from a job card"""
        try:
            selectors = {
                "title": "h2.job-title, div.job-title",
                # Updated company selector with more possible variations
                "company": ".company-name, .styles_companyName__g4soR, [data-test='job-company-name']",
                "location": "div.location-badge, span.location",
                "job_type": "div.job-type-badge, span.job-type",
                "experience": "div.experience-badge, span.experience",
                "link": "a.job-link[href*='/jobs/']"
            }


            data = {}
            for key, selector in selectors.items():
                try:
                    element = card.find_element(By.CSS_SELECTOR, selector)
                    data[key] = element.text.strip() if key != "link" else element.get_attribute("href")
                    WebDriverWait(self.driver, 10).until(
                         EC.presence_of_element_located((By.CSS_SELECTOR, ".company-name"))
                    )
                except NoSuchElementException:
                    data[key] = f"No {key} found"
                    

            # Additional fields
            data["salary"] = self._safe_extract(card, "div.salary-range", "Not specified")
            data["posted_date"] = self._safe_extract(card, "div.posted-date", "Recently posted")
            data["description"] = self._safe_extract(card, "div.job-description", "No description available")
            data["keyword"] = keyword

            return data
        except Exception as e:
            logging.error(f"Error extracting job data: {str(e)}")
            return None
        

    def _safe_extract(self, card, selector: str, default: str) -> str:
        """Safely extract text from an element"""
        try:
            element = card.find_element(By.CSS_SELECTOR, selector)
            return element.text.strip()
        except NoSuchElementException:
            return default
