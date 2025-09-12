import re
from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://users.bugred.ru/user/login/index/#/")
    page.locator("input[name=\"login\"]").click()
    page.locator("input[name=\"login\"]").fill("y@gmail.com")
    page.get_by_role("rowgroup").filter(has_text="Email Пароль Авторизоваться").locator("input[name=\"password\"]").click()
    page.get_by_role("rowgroup").filter(has_text="Email Пароль Авторизоваться").locator("input[name=\"password\"]").fill("444")
    page.get_by_role("button", name="Авторизоваться").click()
    page.get_by_role("link", name="Задачи").click()
    page.get_by_role("link", name="Добавить задачу").click()
    page.locator("input[name=\"name\"]").click()
    page.locator("input[name=\"name\"]").fill("купить яблоки")
    page.locator("textarea[name=\"description\"]").click()
    page.locator("textarea[name=\"description\"]").fill("Много")
    page.get_by_role("textbox", name="Не указывать").click()
    page.get_by_role("treeitem", name="yifna (y@gmail.com)").click()
    page.get_by_role("button", name="Добавить задачу").click()
    page.get_by_role("contentinfo").click()
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
