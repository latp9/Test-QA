from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from schemas import STaskAdd 
from repository import TaskRepository
from schemas import STask
from schemas import STaskId
from sqlalchemy.exc import SQLAlchemyError


router = APIRouter(
    prefix="/tasks",
    tags = ["Таски"]
)

@router.post("")
async def add_task(
    # task: Annotated[STaskAdd, Depends()], используй Depends если нужно вводить данный через params а не body

        task: STaskAdd
) -> STaskId:
    try:
        task_id = await TaskRepository.add_one(task)
        return STaskId(ok=True, task_id=task_id, data=task)
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка базы данных: {str(e)}"
        )


@router.get("/find_all")
async def get_tasks() -> list[STask]:
    """Получить все задачи"""
    try:
        tasks = await TaskRepository.find_all()
        return tasks
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e) 
        )       


@router.delete("/{task_id}", response_model=dict)
async def delete_task(task_id: int):
    try:
        success = await TaskRepository.delete_one(task_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Задача с ID {task_id} не найдена"
            )
        return {"status": "DeleteID", "deleted_id": task_id}
    
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка базы данных: {str(e)}"
        )