from database import new_session, TaskOrm

from schemas import STaskAdd, STask
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
 

class TaskRepository:
    @classmethod
    async def add_one(cls, data: STaskAdd) -> int:
        async with new_session() as session:
            task_dict = data.model_dump()

            task = TaskOrm(**task_dict)
            session.add(task)
            await session.flush()
            await session.commit()
            return task.id



    @classmethod
    async def find_all(cls) -> list[STask]:
        async with new_session() as session:
            query = select(TaskOrm)
            result = await session.execute(query)
            task_models = result.scalars().all()
            task_schemas = [STask.model_validate(task_model) for task_model in task_models]
            return task_schemas
        

    @classmethod
    async def delete_one(cls, task_id: int) -> bool:
        print(f"Attempting to delete task {task_id}")  # Лог
        async with new_session() as session:
            task = await session.get(TaskOrm, task_id)
            print(f"Task found: {bool(task)}")  # Лог
            
            if not task:
                return False
                
            await session.delete(task)
            await session.commit()
            print("Delete successful")  # Лог
            return True
