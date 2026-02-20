from fastapi import APIRouter, Depends
from typing import List
from database import get_db
from services.prediction_service import predict_next_period
from dependencies import get_current_user

router = APIRouter(prefix="/predictions", tags=["Predictions"])


@router.get("")
async def get_predictions(current_user=Depends(get_current_user)):
    db = get_db()
    
    # Get all cycles to calculate stats
    cursor = db.cycles.find({"user_id": current_user["_id"]}).sort("start_date", 1)
    cycles = await cursor.to_list(length=100)
    
    prediction = predict_next_period(
        cycles,
        user_avg_cycle=current_user.get("average_cycle_length", 28),
        user_avg_period=current_user.get("average_period_length", 5)
    )
    
    return prediction
