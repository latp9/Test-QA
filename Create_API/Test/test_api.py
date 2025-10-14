import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from schemas import STask
import pytest
from schemas import STask
from conftest import generate_random_task   

@pytest.mark.asyncio
async def test_task():
    assert True
   

@pytest.mark.asyncio
async def test_get_tasks(async_client):
    response = await async_client.get("/tasks/find_all")
    assert response.status_code == 200
        # Проверяем, что каждый элемент соответствует схеме STask

    data = response.json()
    for item in data:
        STask.model_validate(item)
 
@pytest.mark.asyncio
async def test_add_task(async_client):
    payload = generate_random_task()
    response = await async_client.post("/tasks", json=payload)
    assert response.status_code in [200, 201]
    data = response.json()
    assert data["ok"] is True
    assert "task_id" in data
    assert data["data"]["Имя"] == payload["Имя"]
    assert data["data"]["Возраст"] == payload["Возраст"]
    assert data["data"]["Работа"] == payload["Работа"]
    assert data["data"]["Образование"] == payload["Образование"]
    print(response.json())