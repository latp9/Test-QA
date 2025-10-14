import sys
import os

import pytest_asyncio
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


import pytest
from httpx import AsyncClient, ASGITransport
from main import app  # импортируй свой FastAPI app
import random
from faker import Faker # type: ignore



@pytest_asyncio.fixture
async def async_client():
    """Фикстура для асинхронного клиента FastAPI"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac




fake = Faker("ru_RU")  # создаём фейкер с русской локалью



def generate_random_task():
    names = ["Алина", "Игорь", "Михаил", "Екатерина", "Сергей", "Наталья"]
    jobs = ["Продавец", "Менеджер", "Кассир", "Разработчик", "Аналитик", "Оператор"]
    educations = ["Торговое", "Техническое", "Экономическое", "Среднее", "Высшее"]

    payload = {
        "Имя": random.choice(names),
        "Возраст": random.randint(18, 60),
        "Работа": random.choice(jobs),
        "Образование": random.choice(educations)
    }
    return payload


@pytest_asyncio.fixture
async def test_task(async_client):
    """Создаёт случайную задачу перед тестом"""
    payload = generate_random_task()

    response = await async_client.post("/tasks", json=payload)
    assert response.status_code in [200, 201]

    data = response.json()
    task_id = data.get("task_id") or data.get("id")

    yield {"id": task_id, **payload}

    if task_id:
        await async_client.delete(f"/tasks/{task_id}") 
        # удаляем задачу после теста, если нужно




