import os
import time

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

APP_URL = os.environ.get("APP_URL", "http://127.0.0.1:1234")


@pytest.fixture
def driver():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    browser = webdriver.Chrome(options=opts)
    browser.implicitly_wait(3)
    yield browser
    browser.quit()


def _open_register(browser):
    browser.get(APP_URL)
    WebDriverWait(browser, 5).until(
        lambda d: d.find_element(By.CSS_SELECTOR, "[data-testid='registration-form']")
    )


def _fill(browser, username="", email="", password=""):
    fields = {
        "[data-testid='registration-username']": username,
        "[data-testid='registration-email']": email,
        "[data-testid='registration-password']": password,
    }
    for selector, value in fields.items():
        el = browser.find_element(By.CSS_SELECTOR, selector)
        el.clear()
        if value:
            el.send_keys(value)


def _submit(browser):
    browser.find_element(By.CSS_SELECTOR, "[data-testid='registration-submit']").click()


def _status(browser):
    el = WebDriverWait(browser, 5).until(
        lambda d: d.find_element(By.CSS_SELECTOR, "[data-testid='registration-status']")
    )
    return el.text.lower()


class TestRegistrationValidation:
    def test_required_fields(self, driver):
        _open_register(driver)
        _fill(driver)
        _submit(driver)
        assert "obowiązkowe" in _status(driver)

    @pytest.mark.parametrize(
        "username,email,password",
        [
            ("", "jan@example.com", "secret123"),
            ("jan", "", "secret123"),
            ("jan", "jan@example.com", ""),
            ("   ", "jan@example.com", "secret123"),
            ("jan", "   ", "secret123"),
        ],
    )
    def test_single_required_field_missing(self, driver, username, email, password):
        _open_register(driver)
        _fill(driver, username=username, email=email, password=password)
        _submit(driver)
        assert "obowiązkowe" in _status(driver)

    def test_invalid_email_format(self, driver):
        _open_register(driver)
        _fill(driver, username="jan", email="invalid-email", password="secret123")
        _submit(driver)
        assert "nieprawidłowy format" in _status(driver)

    @pytest.mark.parametrize("email", ["janexample.com", "jan@", "@example.com", "jan@com", "jan@@example.com"])
    def test_more_invalid_email_formats(self, driver, email):
        _open_register(driver)
        _fill(driver, username="jan", email=email, password="secret123")
        _submit(driver)
        assert "nieprawidłowy format" in _status(driver)

    def test_valid_email_with_spaces_around(self, driver):
        _open_register(driver)
        unique = int(time.time() * 1000)
        _fill(driver, username=f"jan{unique}", email=f"  jan{unique}@example.com  ", password="secret123")
        _submit(driver)
        status = _status(driver)
        assert "nieprawidłowy format" not in status

    def test_valid_email_not_rejected(self, driver):
        _open_register(driver)
        unique = int(time.time() * 1000)
        _fill(driver, username=f"jan{unique}", email=f"jan{unique}@example.com", password="secret123")
        _submit(driver)
        status = _status(driver)
        assert "nieprawidłowy format" not in status
