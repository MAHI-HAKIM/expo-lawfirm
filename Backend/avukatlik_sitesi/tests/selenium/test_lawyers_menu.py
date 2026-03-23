import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LawyersNavigationTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def test_navigate_to_lawyers(self):
        driver = self.driver

        # Step 1: Go to Sign In
        try:
            get_started = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[text()='Get Started']"))
            )
            get_started.click()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
            print("✅ Reached login page")
        except Exception as e:
            self.fail(f"❌ Could not open login page: {str(e)}")

        # Step 2: Login as normal user
        try:
            driver.find_element(By.ID, "email").send_keys("esne1707@gmail.com")  
            driver.find_element(By.ID, "password").send_keys("nesi123")   
            driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()
            print("✅ Submitted login form")
        except Exception as e:
            self.fail(f"❌ Failed to login: {str(e)}")

        # Step 3: Wait for sidebar to appear
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//span[text()='Lawyers']"))
            )
            print("✅ Sidebar loaded")
        except Exception as e:
            self.fail(f"❌ Sidebar did not load: {str(e)}")

        # Step 4: Click on "Lawyers"
        try:
            lawyers_link = driver.find_element(By.XPATH, "//span[text()='Lawyers']")
            lawyers_link.click()
            print("✅ Clicked on Lawyers link")
        except Exception as e:
            self.fail(f"❌ Could not click Lawyers link: {str(e)}")

        # Step 5: Verify Lawyers page loaded
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Lawyers')]"))
            )
            print("✅ Lawyers page is visible")
        except Exception as e:
            self.fail(f"❌ Lawyers page not found: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
