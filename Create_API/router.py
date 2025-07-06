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




@router.post("/Add")
async def add_task(task: Annotated[STaskAdd, Depends()]) -> STaskId:
    try:
        task_id = await TaskRepository.add_one(task)
        return {"ok": True, "task_id": task_id}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)  # Покажет реальную ошибку
        )


@router.get("/Find_all")
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


# @router.delete("/Удалить/{task_id}")
# async def delete_task(task_id: int) -> dict:
#     try:
#         await TaskRepository.delete_one(task_id)
#         return {"ok": True, "task_id": task_id}
    
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=str(e) 
#         )   

@router.delete("/{task_id}", response_model=dict)
async def delete_task(task_id: int):
    try:
        success = await TaskRepository.delete_one(task_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Задача с ID {task_id} не найдена"
            )
        return {"status": "Delete ID", "deleted_id": task_id}
    
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка базы данных: {str(e)}"
        )