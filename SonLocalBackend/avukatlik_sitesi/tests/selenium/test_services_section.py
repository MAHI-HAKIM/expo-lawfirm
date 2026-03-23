import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By

class ServicesSectionTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.driver.get("http://localhost:3000")  # Replace with your actual URL
        time.sleep(2)

    def test_scroll_and_click_view_all_services(self):
        driver = self.driver

        # Scroll to "Our Services" section
        try:
            services_section = driver.find_element(By.XPATH, "//p[text()='/ OUR SERVICES']")
            driver.execute_script("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", services_section)
            time.sleep(2)
            print("✅ Scrolled to 'Our Services' section")
        except Exception as e:
            self.fail(f"❌ Could not scroll to 'Our Services': {str(e)}")

        # Click "View All Services"
        try:
            view_all_button = driver.find_element(By.XPATH, "//a[text()='View All Services']")
            view_all_button.click()
            time.sleep(2)
            print("✅ Clicked 'View All Services' button")
        except Exception as e:
            self.fail(f"❌ Failed to click 'View All Services': {str(e)}")

        # Confirm navigation
        try:
            self.assertIn("services", driver.current_url.lower())
            print(f"✅ Navigated to Services Page: {driver.current_url}")
        except Exception as e:
            self.fail(f"❌ Not on Services page after clicking the button: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
