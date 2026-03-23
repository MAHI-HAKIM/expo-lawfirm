import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class AppointmentListDisplayTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def test_appointments_visible_after_login(self):
        driver = self.driver

        # Step 1: Login
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[text()='Get Started']"))
            ).click()

            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
            driver.find_element(By.ID, "email").send_keys("normal@example.com")  # UPDATE as needed
            driver.find_element(By.ID, "password").send_keys("normalpass123")    # UPDATE as needed
            driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()
            print("✅ Logged in successfully")
        except Exception as e:
            self.fail(f"❌ Login failed: {str(e)}")

        # Step 2: Wait for dashboard and locate appointment section
        try:
            appointment_section = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Upcoming Appointments')]"))
            )
            print("✅ Found 'Upcoming Appointments' section")
        except:
            self.fail("❌ 'Upcoming Appointments' section not found")

        # Step 3: Check that at least one appointment row/card exists
        try:
            appointments = driver.find_elements(By.XPATH, "//tr[contains(@class, 'appointment-row')] | //div[contains(@class, 'appointment-card')]")
            self.assertGreater(len(appointments), 0, "No appointments found.")
            print(f"✅ {len(appointments)} appointment(s) visible on dashboard")
        except Exception as e:
            self.fail(f"❌ Appointments not loaded properly: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
