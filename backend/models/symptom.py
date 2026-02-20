from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SymptomCreate(BaseModel):
    date: str  # ISO date YYYY-MM-DD
    cramps: Optional[int] = 0        # 0-3 severity
    bloating: Optional[int] = 0
    headache: Optional[int] = 0
    backache: Optional[int] = 0
    mood: Optional[str] = None       # happy/sad/anxious/irritable/calm
    energy: Optional[str] = None     # high/medium/low/exhausted
    breast_tenderness: Optional[bool] = False
    acne: Optional[bool] = False
    nausea: Optional[bool] = False
    discharge: Optional[str] = None  # none/light/moderate/heavy
    notes: Optional[str] = None


class SymptomResponse(BaseModel):
    id: str
    user_id: str
    date: str
    cramps: int
    bloating: int
    headache: int
    backache: int
    mood: Optional[str]
    energy: Optional[str]
    breast_tenderness: bool
    acne: bool
    nausea: bool
    discharge: Optional[str]
    notes: Optional[str]
    created_at: str
