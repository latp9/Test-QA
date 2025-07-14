# import pytest


# @pytest.fixture(scope="session")
# def browser_context_args (browser_context_args):
#     return {
#         **browser_context_args,
#         "viewport": {"width": 1280, "height": 720},
#         "ignore_https_errors": True,
#     }


import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "storage_state": {
            "cookies": [
                {
                    "name": "sessionid",
                    "value": "your_session_id_here",  # Замените на ваш session ID
                    "url": "https://example.com"  # Замените на нужный URL
                },
            ]
        },
    }