from fastapi import FastAPI

from contextlib import asynccontextmanager
from database import create_tables, delete_tables

from router import router as tasks_router
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__) 

@asynccontextmanager
async def lifespan(app: FastAPI):

    # await delete_tables()
    # print("База отчищена")
    await create_tables()
    print("Создание базы")
    print("Запуск") 
    yield
    print("Выключение")
    # Here you can add any cleanup code if needed



app = FastAPI(lifespan=lifespan)

app.include_router(tasks_router)


