from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class FlowLevel(str):
    LIGHT = "light"
    MEDIUM = "medium"
    HEAVY = "heavy"
    SPOTTING = "spotting"


class CycleCreate(BaseModel):
    start_date: str  # ISO date YYYY-MM-DD
    end_date: Optional[str] = None
    flow_level: Optional[str] = "medium"  # light/medium/heavy/spotting
    notes: Optional[str] = None


class CycleUpdate(BaseModel):
    end_date: Optional[str] = None
    flow_level: Optional[str] = None
    notes: Optional[str] = None


class CycleResponse(BaseModel):
    id: str
    user_id: str
    start_date: str
    end_date: Optional[str] = None
    flow_level: str
    duration: Optional[int] = None  # days
    notes: Optional[str] = None
    created_at: str
