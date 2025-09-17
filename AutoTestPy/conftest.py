import pytest
from selenium import webdriver  
from selenium.webdriver.chrome.options import Options


@pytest.fixture
def browser():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=') #тесты будут запускаться в режиме без открытия окна браузера

    browser = webdriver.Chrome(options=options)
    browser.maximize_window()
    browser.implicitly_wait(5)  
    yield browser