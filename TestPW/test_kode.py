import re
from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://edu.kode.ru/#napr/#/")
    page.get_by_role("button", name="П О Д А Т Ь   З А Я В К У П О Д А Т Ь   З А Я В К У").click()
    page.locator("#sb-1742814762118").select_option("QA")
    page.get_by_role("textbox", name="name").click()
    page.get_by_role("textbox", name="name").fill("Алина Латыпова")
    page.locator("input[name=\"Возраст\"]").click()
    page.locator("input[name=\"Возраст\"]").fill("25")
    page.locator("input[name=\"Локация\"]").click()
    page.locator("input[name=\"Локация\"]").fill("Калининград")



    # ---------------------




with sync_playwright() as playwright:
    run(playwright)
