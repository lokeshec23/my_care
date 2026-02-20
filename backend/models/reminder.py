from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReminderCreate(BaseModel):
    type: str  # "period", "ovulation", "contraceptive", "logs"
    time: str  # "HH:mm"
    enabled: bool = True
    days_before: int = 1


class ReminderResponse(BaseModel):
    id: str
    user_id: str
    type: str
    time: str
    enabled: bool
    days_before: int
    created_at: str
