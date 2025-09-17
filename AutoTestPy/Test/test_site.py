
from selenium.webdriver.common.by import By    
import time
from Pages.homepage import HomePage
from Pages.prodact import ProdactPage



def test_open_s6(browser: None):
    homepage=HomePage(browser)
    homepage.open()
    homepage.click_to_galaxy_s6()
    prodact_page=ProdactPage(browser)
    prodact_page.check_title_is("Samsung galaxy s6")
   
        

def test_two_monittors(browser: None):
    homepage=HomePage(browser)
    homepage.open()
    homepage.click_to_monitor()

    time.sleep(3)  #Плохое решение(без него не проходит) нужно явное ожидание Wait for the monitors to load 
    produt_page=ProdactPage(browser)
    produt_page.check_product_count(2)
    






    # monitors = browser.find_element(By.XPATH, value="//a[text()='Monitors']")
    # monitors.click()
    # monitor_1 = browser.find_element(By.XPATH, value="//a[text()='Apple monitor 24']")
    # monitor_1.click()
    # title_1 = browser.find_element(By.CSS_SELECTOR, value="h2") 
    # assert title_1.text  == "Apple monitor 24"
    # browser.back()
    # monitor_2 = browser.find_element(By.XPATH, value="//a[text()='ASUS Full HD']")
    # monitor_2.click()
    # title_2 = browser.find_element(By.CSS_SELECTOR, value="h2") 
    # assert title_2.text  == "ASUS Full HD"