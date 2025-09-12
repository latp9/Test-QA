import re
from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://vk.com/?u=2&to=L2FsX2ltLnBocA--")
    page.get_by_test_id("enter-another-way").click()
    page.get_by_role("textbox", name="+7 000 000 00").fill("+7 996 105 68 07")
    page.get_by_role("textbox", name="+7 000 000 00").press("Enter")
    page.locator("[data-test-id=\"submit_btn\"]").click()
    page.locator(".vkc__TextField__input").first.fill("2")
    page.locator("div:nth-child(2) > div > .vkc__TextField__wrapper > .vkc__TextField__input").fill("0")
    page.locator("div:nth-child(3) > div > .vkc__TextField__wrapper > .vkc__TextField__input").fill("1")
    page.locator("div:nth-child(4) > div > .vkc__TextField__wrapper > .vkc__TextField__input").fill("3")
    page.locator("div:nth-child(5) > div > .vkc__TextField__wrapper > .vkc__TextField__input").fill("5")
    page.locator("div:nth-child(6) > div > .vkc__TextField__wrapper > .vkc__TextField__input").fill("7")
    page.get_by_role("link", name="Мессенджер").click()
    page.get_by_text("Кристина Лямина Пост· 21").click()

    page.get_by_role("textbox", name="Сообщение").fill("привет красотка")
    page.close()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)


# Помеха в виде кода на телефон