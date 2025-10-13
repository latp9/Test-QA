
from pydantic import BaseModel
from pydantic import ConfigDict


class STaskAdd(BaseModel):
    Имя: str
    Возраст: int
    Работа: str | None = None
    Образование: str | None = None



class STask(STaskAdd):
    id: int
    model_config = ConfigDict(from_attributes=True)


class STaskId(BaseModel):
    ok: bool = True
    task_id: int

class STaskDelete(BaseModel):
    ok: bool = True
    task_id: int

    class ConfigDict:
        json_schema_extra = {
            "example": {
                "ok": True,
                "task_id": 1
            }
        }