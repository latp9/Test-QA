from selenium.webdriver.common.by import By

class ProdactPage:

    def __init__(self, browser):
        self.browser = browser

    def check_title_is(self, titel):
        page_title = self.browser.find_element(By.CSS_SELECTOR, value="h2") 
        assert page_title.text == titel
    def check_product_count(self, count):
        products = self.browser.find_elements(By.CSS_SELECTOR, value=".card-block")
        assert len(products) == count