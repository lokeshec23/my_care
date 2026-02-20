from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    date_of_birth: Optional[str] = None  # ISO date string YYYY-MM-DD
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    average_cycle_length: Optional[int] = 28
    average_period_length: Optional[int] = 5


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    date_of_birth: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    is_onboarded: bool = False
    average_cycle_length: int = 28
    average_period_length: int = 5
    created_at: datetime


class UserUpdateProfile(BaseModel):
    name: Optional[str] = None
    date_of_birth: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    is_onboarded: Optional[bool] = None
    average_cycle_length: Optional[int] = None
    average_period_length: Optional[int] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile
