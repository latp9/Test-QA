from fastapi import APIRouter, Depends
from typing import Annotated
from schemas import STaskAdd 
from repository import TaskRepository
from fastapi import HTTPException
from schemas import STask
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import STaskId
router = APIRouter(
    prefix="/tasks",
    tags = ["Таски"]
)




@router.post("/Добавить")
async def add_task(task: Annotated[STaskAdd, Depends()]) -> STaskId:
    try:
        task_id = await TaskRepository.add_one(task)
        return {"ok": True, "task_id": task_id}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str()  # Покажет реальную ошибку
        )


@router.get("/Найти")
async def get_tasks() -> list[STask]:

    tasks = await TaskRepository .find_all()
    return tasks

