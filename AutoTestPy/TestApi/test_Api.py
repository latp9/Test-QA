from pydantic import BaseModel
from typing import List
from faker import Faker
import random



fake= Faker()


class Category(BaseModel):
    id:int
    name:str


class Tag(BaseModel):
    id:int
    name:str

class Pet(BaseModel):
    id: int
    category: Category
    name: str
    photoUrls: List[str]
    tags: List[Tag]
    status: str

pet = Pet (
    id=fake.random_int(min=1, max=100),
    
)