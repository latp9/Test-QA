from selenium import webdriver
from selenium.webdriver.common.by import By    
import pytest



@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.maximize_window()
    yield
    return driver

def test_open_s6(driver: None):
    driver = webdriver.Chrome()
    driver.get("https://www.demoblaze.com/index.html")
    galaxy_s6 = driver.find_element(By.LinkText, value="Samsung galaxy s6")
    galaxy_s6.click()
    title = driver.find_element(By.TagName, value="h2").text 
    assert title == "Samsung galaxy s6"