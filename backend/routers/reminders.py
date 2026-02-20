from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import List
from bson import ObjectId
from database import get_db
from models.reminder import ReminderCreate, ReminderResponse
from dependencies import get_current_user

router = APIRouter(prefix="/reminders", tags=["Reminders"])


def reminder_to_response(reminder: dict) -> ReminderResponse:
    return ReminderResponse(
        id=str(reminder["_id"]),
        user_id=str(reminder["user_id"]),
        type=reminder["type"],
        time=reminder["time"],
        enabled=reminder.get("enabled", True),
        days_before=reminder.get("days_before", 1),
        created_at=reminder["created_at"].isoformat() if isinstance(reminder["created_at"], datetime) else reminder["created_at"],
    )


@router.post("", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
async def create_reminder(data: ReminderCreate, current_user=Depends(get_current_user)):
    db = get_db()
    now = datetime.utcnow()
    
    # Check if a reminder of this type already exists for the user
    existing = await db.reminders.find_one({
        "user_id": current_user["_id"],
        "type": data.type
    })
    
    doc = data.model_dump()
    doc["user_id"] = current_user["_id"]
    doc["created_at"] = now
    
    if existing:
        await db.reminders.replace_one({"_id": existing["_id"]}, doc)
        doc["_id"] = existing["_id"]
    else:
        result = await db.reminders.insert_one(doc)
        doc["_id"] = result.inserted_id
        
    return reminder_to_response(doc)


@router.get("", response_model=List[ReminderResponse])
async def get_reminders(current_user=Depends(get_current_user)):
    db = get_db()
    cursor = db.reminders.find({"user_id": current_user["_id"]})
    reminders = await cursor.to_list(length=100)
    return [reminder_to_response(r) for r in reminders]


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(reminder_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    result = await db.reminders.delete_one({
        "_id": ObjectId(reminder_id),
        "user_id": current_user["_id"]
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Reminder not found")
