import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By

class ContactFormTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.driver.get("http://localhost:3000")  # Replace if needed
        time.sleep(2)

    def test_fill_and_submit_contact_form(self):
        driver = self.driver

        # Scroll to "Contact Us" section
        try:
            contact_heading = driver.find_element(By.XPATH, "//p[text()='/ CONTACT US']")
            driver.execute_script("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", contact_heading)
            time.sleep(2)
            print("✅ Scrolled to Contact Us section")
        except Exception as e:
            self.fail(f"❌ Failed to scroll to Contact Us section: {str(e)}")

        # Fill the form
        try:
            driver.find_element(By.ID, "firstName").send_keys("Ahmet")
            driver.find_element(By.ID, "lastName").send_keys("Mustafa")
            driver.find_element(By.ID, "phone").send_keys("1234567890")
            driver.find_element(By.ID, "email").send_keys("john@example.com")
            driver.find_element(By.ID, "subject").send_keys("Test Subject")
            driver.find_element(By.ID, "message").send_keys("This is a test message from Selenium.")
            print("✅ Filled out contact form fields")
        except Exception as e:
            self.fail(f"❌ Failed to fill the form: {str(e)}")

        # Submit the form
        try:
            send_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Send Message')]")
            send_button.click()
            time.sleep(2)
            print("✅ Clicked 'Send Message'")
        except Exception as e:
            self.fail(f"❌ Failed to click 'Send Message': {str(e)}")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
