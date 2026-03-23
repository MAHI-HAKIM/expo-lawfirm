import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class HomePageNavigationTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.driver.get("http://localhost:3000")
        cls.wait = WebDriverWait(cls.driver, 15)
        time.sleep(2)  # allow initial animations to complete

    def test_full_nav_and_get_started(self):
        driver = self.driver
        wait = self.wait

        # Step 1: Navigate through navbar links
        nav_links = ["Home", "About", "Attorneys", "Blog", "Contact"]
        for link_text in nav_links:
            try:
                print(f"🔍 Looking for: {link_text}")
                wait.until(EC.presence_of_element_located((By.LINK_TEXT, link_text)))
                link = driver.find_element(By.LINK_TEXT, link_text)
                link.click()
                time.sleep(1)
                print(f"✅ Navigated to: {link_text}")
            except Exception as e:
                self.fail(f"❌ Failed to navigate to {link_text}: {str(e)}")

        # Step 2: Click the "Get Started" button
        try:
            get_started = driver.find_element(By.XPATH, "//a[contains(@class, 'rounded-lg') and text()='Get Started']")
            get_started.click()
            time.sleep(2)
            print("✅ Clicked 'Get Started'")
            self.assertIn("/signin", driver.current_url)
        except Exception as e:
            self.fail(f"❌ Failed to click 'Get Started': {str(e)}")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
