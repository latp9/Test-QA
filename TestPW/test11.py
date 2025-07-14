import re
from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.get_by_role("row", name="John Doe john.doe@gmail.com").locator("div").first.click()
    page.get_by_role("cell", name="Software engineer IT").click()
    page.get_by_role("cell", name="Senior").first.click()
    page.get_by_role("cell", name="Edit").first.click()
    page.get_by_role("cell", name="Consultant Finance").click()
    expect(page.locator("tbody")).to_contain_text("Alex Ray alex.ray@gmail.com assdf")
    page.get_by_role("cell", name="Kate Hunington kate.hunington").locator("div").first.click()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)