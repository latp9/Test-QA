import re
from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://demo.playwright.dev/todomvc/#/")
    page.get_by_role("textbox", name="What needs to be done?").click()
    page.get_by_role("textbox", name="What needs to be done?").fill("")
    page.get_by_role("textbox", name="What needs to be done?").press("CapsLock")
    page.get_by_role("textbox", name="What needs to be done?").fill("купи хлеб")
    page.get_by_role("textbox", name="What needs to be done?").press("Enter")
    page.get_by_role("textbox", name="What needs to be done?").fill("будь дома в 16:00")
    page.get_by_role("textbox", name="What needs to be done?").press("Enter")
    page.get_by_role("listitem").filter(has_text="купи хлеб").get_by_label("Toggle Todo").check()
    page.get_by_role("listitem").filter(has_text="будь дома в 16:00").get_by_label("Toggle Todo").check()
    page.get_by_role("link", name="Completed").click()
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
