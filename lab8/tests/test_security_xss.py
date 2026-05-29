import os

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


def _arm_xss_guard(browser):
    browser.execute_script(
        "window.__xss_hit = false;"
        "window.alert = function(){ window.__xss_hit = true; };"
    )


def _fill(browser, username="", email="", password="secret123"):
    data = {
        "[data-testid='registration-username']": username,
        "[data-testid='registration-email']": email,
        "[data-testid='registration-password']": password,
    }
    for selector, value in data.items():
        el = browser.find_element(By.CSS_SELECTOR, selector)
        el.clear()
        if value:
            el.send_keys(value)


def _submit(browser):
    browser.find_element(By.CSS_SELECTOR, "[data-testid='registration-submit']").click()


def _status_text(browser):
    el = WebDriverWait(browser, 5).until(
        lambda d: d.find_element(By.CSS_SELECTOR, "[data-testid='registration-status']")
    )
    return el.text.lower()


class TestXssSecurity:
    @pytest.mark.parametrize(
        "username,email",
        [
            ("<script>alert(1)</script>", "jan@example.com"),
            ("<img src=x onerror=alert(1)>", "jan@example.com"),
            ("jan", "<svg onload=alert(1)>"),
        ],
    )
    def test_payload_does_not_execute_javascript(self, driver, username, email):
        _open_register(driver)
        _arm_xss_guard(driver)
        _fill(driver, username=username, email=email)
        _submit(driver)

        _ = _status_text(driver)
        xss_hit = driver.execute_script("return window.__xss_hit === true;")
        assert xss_hit is False

    def test_invalid_email_payload_returns_safe_text(self, driver):
        _open_register(driver)
        _arm_xss_guard(driver)
        payload = "<img src=x onerror=alert(1)>"
        _fill(driver, username="jan", email=payload)
        _submit(driver)

        status = _status_text(driver)
        assert "nieprawidłowy format" in status
        assert "onerror" not in status
        xss_hit = driver.execute_script("return window.__xss_hit === true;")
        assert xss_hit is False

    def test_script_tags_not_injected_to_dom(self, driver):
        _open_register(driver)
        _arm_xss_guard(driver)
        payload = "<script>window.__xss_hit=true</script>"
        _fill(driver, username=payload, email="jan@example.com")
        _submit(driver)

        _ = _status_text(driver)
        page_html = driver.page_source.lower()
        assert "<script>window.__xss_hit=true</script>" not in page_html
        xss_hit = driver.execute_script("return window.__xss_hit === true;")
        assert xss_hit is False
