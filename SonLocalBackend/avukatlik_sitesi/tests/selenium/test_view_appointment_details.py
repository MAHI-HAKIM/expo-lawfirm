import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class AppointmentDetailsTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def test_user_can_open_appointment_detail(self):
        driver = self.driver

        # Step 1: Login
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[text()='Get Started']"))
            ).click()

            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
            driver.find_element(By.ID, "email").send_keys("normal@example.com")  # UPDATE
            driver.find_element(By.ID, "password").send_keys("normalpass123")    # UPDATE
            driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()
            print("✅ Logged in successfully")
        except Exception as e:
            self.fail(f"❌ Login failed: {str(e)}")

        # Step 2: Wait for appointment list to load
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Upcoming Appointments')]"))
            )
            print("✅ Found appointment section")
        except Exception as e:
            self.fail(f"❌ Appointment section not visible: {str(e)}")

        # Step 3: Click on first appointment item
        try:
            appointment_item = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//tr[contains(@class, 'appointment-row')] | //div[contains(@class, 'appointment-card')]"))
            )
            appointment_item.click()
            print("✅ Clicked on appointment item")
        except Exception as e:
            self.fail(f"❌ Failed to click appointment: {str(e)}")

        # Step 4: Confirm detail is shown
        try:
            detail_modal = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Appointment Details')] | //div[contains(@class, 'modal')]"))
            )
            self.assertTrue(detail_modal.is_displayed())
            print("✅ Appointment details are visible")
        except Exception as e:
            self.fail(f"❌ Appointment details not displayed: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
