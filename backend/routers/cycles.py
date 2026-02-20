from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import List
from bson import ObjectId
from database import get_db
from models.cycle import CycleCreate, CycleUpdate, CycleResponse
from dependencies import get_current_user

router = APIRouter(prefix="/cycles", tags=["Cycles"])


def cycle_to_response(cycle: dict) -> CycleResponse:
    duration = None
    if cycle.get("end_date") and cycle.get("start_date"):
        try:
            s = datetime.strptime(cycle["start_date"], "%Y-%m-%d")
            e = datetime.strptime(cycle["end_date"], "%Y-%m-%d")
            duration = (e - s).days + 1
        except Exception:
            pass
    return CycleResponse(
        id=str(cycle["_id"]),
        user_id=str(cycle["user_id"]),
        start_date=cycle["start_date"],
        end_date=cycle.get("end_date"),
        flow_level=cycle.get("flow_level", "medium"),
        duration=duration,
        notes=cycle.get("notes"),
        created_at=cycle["created_at"].isoformat() if isinstance(cycle["created_at"], datetime) else cycle["created_at"],
    )


@router.post("", response_model=CycleResponse, status_code=status.HTTP_201_CREATED)
async def log_cycle(data: CycleCreate, current_user=Depends(get_current_user)):
    db = get_db()
    now = datetime.utcnow()
    doc = {
        "user_id": current_user["_id"],
        "start_date": data.start_date,
        "end_date": data.end_date,
        "flow_level": data.flow_level or "medium",
        "notes": data.notes,
        "created_at": now,
    }
    result = await db.cycles.insert_one(doc)
    doc["_id"] = result.inserted_id
    return cycle_to_response(doc)


@router.get("", response_model=List[CycleResponse])
async def get_cycles(current_user=Depends(get_current_user)):
    db = get_db()
    cursor = db.cycles.find({"user_id": current_user["_id"]}).sort("start_date", -1)
    cycles = await cursor.to_list(length=100)
    return [cycle_to_response(c) for c in cycles]


@router.get("/{cycle_id}", response_model=CycleResponse)
async def get_cycle(cycle_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    cycle = await db.cycles.find_one(
        {"_id": ObjectId(cycle_id), "user_id": current_user["_id"]}
    )
    if not cycle:
        raise HTTPException(status_code=404, detail="Cycle not found")
    return cycle_to_response(cycle)


@router.put("/{cycle_id}", response_model=CycleResponse)
async def update_cycle(
    cycle_id: str, data: CycleUpdate, current_user=Depends(get_current_user)
):
    db = get_db()
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    result = await db.cycles.find_one_and_update(
        {"_id": ObjectId(cycle_id), "user_id": current_user["_id"]},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Cycle not found")
    return cycle_to_response(result)


@router.delete("/{cycle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cycle(cycle_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    result = await db.cycles.delete_one(
        {"_id": ObjectId(cycle_id), "user_id": current_user["_id"]}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cycle not found")
