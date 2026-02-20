from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import List
from bson import ObjectId
from database import get_db
from models.symptom import SymptomCreate, SymptomResponse
from dependencies import get_current_user

router = APIRouter(prefix="/symptoms", tags=["Symptoms"])


def symptom_to_response(symptom: dict) -> SymptomResponse:
    return SymptomResponse(
        id=str(symptom["_id"]),
        user_id=str(symptom["user_id"]),
        date=symptom["date"],
        cramps=symptom.get("cramps", 0),
        bloating=symptom.get("bloating", 0),
        headache=symptom.get("headache", 0),
        backache=symptom.get("backache", 0),
        mood=symptom.get("mood"),
        energy=symptom.get("energy"),
        breast_tenderness=symptom.get("breast_tenderness", False),
        acne=symptom.get("acne", False),
        nausea=symptom.get("nausea", False),
        discharge=symptom.get("discharge"),
        notes=symptom.get("notes"),
        created_at=symptom["created_at"].isoformat() if isinstance(symptom["created_at"], datetime) else symptom["created_at"],
    )


@router.post("", response_model=SymptomResponse, status_code=status.HTTP_201_CREATED)
async def log_symptom(data: SymptomCreate, current_user=Depends(get_current_user)):
    db = get_db()
    now = datetime.utcnow()
    
    # Check if entry for this date already exists
    existing = await db.symptoms.find_one({
        "user_id": current_user["_id"],
        "date": data.date
    })
    
    doc = data.model_dump()
    doc["user_id"] = current_user["_id"]
    doc["created_at"] = now
    
    if existing:
        await db.symptoms.replace_one({"_id": existing["_id"]}, doc)
        doc["_id"] = existing["_id"]
    else:
        result = await db.symptoms.insert_one(doc)
        doc["_id"] = result.inserted_id
        
    return symptom_to_response(doc)


@router.get("", response_model=List[SymptomResponse])
async def get_symptoms(
    start_date: str = None, 
    end_date: str = None, 
    current_user=Depends(get_current_user)
):
    db = get_db()
    query = {"user_id": current_user["_id"]}
    
    if start_date or end_date:
        query["date"] = {}
        if start_date:
            query["date"]["$gte"] = start_date
        if end_date:
            query["date"]["$lte"] = end_date
            
    cursor = db.symptoms.find(query).sort("date", -1)
    symptoms = await cursor.to_list(length=100)
    return [symptom_to_response(s) for s in symptoms]


@router.get("/{date}", response_model=SymptomResponse)
async def get_symptom_by_date(date: str, current_user=Depends(get_current_user)):
    db = get_db()
    symptom = await db.symptoms.find_one({
        "user_id": current_user["_id"],
        "date": date
    })
    if not symptom:
        raise HTTPException(status_code=404, detail="Symptom log not found for this date")
    return symptom_to_response(symptom)
