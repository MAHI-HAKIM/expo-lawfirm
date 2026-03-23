import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class ResponsiveLayoutTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.get("http://localhost:3000")  # Update to your app URL
        cls.wait = WebDriverWait(cls.driver, 10)  # ⏳ Set up a reusable wait instance

    def wait_and_check_element(self, xpath, description):
        """Wait for element and check visibility."""
        try:
            element = self.wait.until(EC.presence_of_element_located((By.XPATH, xpath)))
            self.assertTrue(element.is_displayed())
            print(f"✅ {description} is visible.")
        except TimeoutException:
            print(f"❌ {description} not found within timeout.")
        except AssertionError:
            print(f"❌ {description} is present but not visible.")

    def test_responsive_views(self):
        screen_sizes = {
            "Desktop": (1440, 900),
            "Tablet": (768, 1024),
            "Mobile": (375, 812)  # iPhone X
        }

        for label, size in screen_sizes.items():
            width, height = size
            self.driver.set_window_size(width, height)
            self.driver.refresh()  # 🔁 Ensures layout reloads for new size
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))  # wait for page load
            print(f"\n🖥️ Testing {label} view ({width}x{height})")

            # Take a screenshot for reference
            self.driver.save_screenshot(f"responsive_{label.lower()}.png")

            # Check logo
            self.wait_and_check_element("//a[contains(text(),'Expo Law')]", "Logo")

            # Check nav links or hamburger menu
            if label == "Mobile":
                self.wait_and_check_element(
                    "//button[contains(@aria-label, 'menu') or contains(@class, 'hamburger')]",
                    "Mobile menu button"
                )
            else:
                self.wait_and_check_element("//a[text()='Contact']", "'Contact' navbar link")

            # Check Get Started button
            self.wait_and_check_element("//a[text()='Get Started']", "'Get Started' button")

            # Scroll and check footer/contact/address
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            self.wait_and_check_element("//*[contains(text(), 'Address')]", "'Address' section in footer")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
