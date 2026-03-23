import unittest
import logging
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AppointmentBookingTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])

        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.wait = WebDriverWait(cls.driver, 20)
        logger.info("✅ Browser started")

    def setUp(self):
        self.driver.get("http://localhost:3000")
        self.wait.until(EC.presence_of_element_located((By.XPATH, "//a[text()='Get Started']")))
        logger.info("✅ Navigated to homepage")

    def login(self):
        self.wait.until(EC.element_to_be_clickable((By.XPATH, "//a[text()='Get Started']"))).click()
        logger.info("➡️ Clicked Get Started")

        self.wait.until(EC.presence_of_element_located((By.ID, "email"))).send_keys("mahi@gmail.com")
        self.wait.until(EC.presence_of_element_located((By.ID, "password"))).send_keys("123456")

        self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign In')]"))).click()
        logger.info("🔐 Submitted login form")

        self.wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Welcome')]")))
        logger.info("✅ Login successful")

    def test_book_appointment(self):
        self.login()

        self.wait.until(EC.element_to_be_clickable((By.XPATH, "//a[span[text()='Book Appointment']]"))).click()
        self.wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Book') and contains(text(), 'Appointment')]")))
        logger.info("📄 On booking page")

        self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@id='case-type-1']"))).click()
        logger.info("🗂️ Selected case type")

        # Try dropdown first
        try:
            lawyer_select = Select(self.wait.until(EC.presence_of_element_located((By.ID, "lawyer"))))
            lawyer_select.select_by_index(1)
            logger.info(f"👤 Selected lawyer: {lawyer_select.first_selected_option.text}")
        except Exception:
            self.wait.until(EC.element_to_be_clickable((By.ID, "lawyer-9"))).click()
            logger.info("🧑‍⚖️ Selected fallback lawyer button")

        # Pick tomorrow's date
        date_str = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        self.wait.until(EC.presence_of_element_located((By.ID, "date"))).send_keys(date_str)
        self.wait.until(EC.presence_of_element_located((By.ID, "time"))).send_keys("14:00")
        logger.info(f"📆 Appointment set for {date_str} at 14:00")

        # Submit
        self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Submit')]"))).click()

        try:
            self.wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'success') or contains(text(), 'confirmed')]")))
            logger.info("✅ Appointment successfully booked")
        except TimeoutException:
            logger.error("❌ No success message after submission")
            raise

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
        logger.info("🚪 Browser closed")

if __name__ == "__main__":
    unittest.main()
