import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from schemas import STask
import pytest
from httpx import AsyncClient, ASGITransport
from main import app



@pytest.mark.asyncio
async def test_get_tasks():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        responce = await ac.get("/tasks/Find_all")
        print(responce)
        data = responce.json()
        assert responce.status_code == 200
        # Проверяем, что каждый элемент соответствует схеме STask
        for item in data:
            STask.model_validate(item)  # выбросит ValidationError, если не соответствует
            print(item)