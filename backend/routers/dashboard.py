from fastapi import APIRouter, Depends
from database import get_db
from dependencies import get_current_user
from services.prediction_service import predict_next_period, calculate_cycle_stats
from datetime import datetime, timedelta

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("")
async def get_dashboard_data(current_user=Depends(get_current_user)):
    db = get_db()
    
    # 1. Get cycles
    cursor = db.cycles.find({"user_id": current_user["_id"]}).sort("start_date", 1)
    cycles = await cursor.to_list(length=100)
    
    # 2. Get predictions
    prediction = predict_next_period(
        cycles,
        user_avg_cycle=current_user.get("average_cycle_length", 28),
        user_avg_period=current_user.get("average_period_length", 5)
    )
    
    # 3. Get recent symptoms (last 7 days)
    today = datetime.utcnow().strftime("%Y-%m-%d")
    week_ago = (datetime.utcnow() - timedelta(days=7)).strftime("%Y-%m-%d")
    
    symptoms_cursor = db.symptoms.find({
        "user_id": current_user["_id"],
        "date": {"$gte": week_ago, "$lte": today}
    }).sort("date", -1)
    recent_symptoms = await symptoms_cursor.to_list(length=7)
    
    # Format symptom IDs
    for s in recent_symptoms:
        s["id"] = str(s["_id"])
        del s["_id"]
        s["user_id"] = str(s["user_id"])
        if isinstance(s["created_at"], datetime):
            s["created_at"] = s["created_at"].isoformat()

    return {
        "user": {
            "name": current_user["name"],
            "email": current_user["email"]
        },
        "prediction": prediction,
        "recent_symptoms": recent_symptoms,
        "stats": calculate_cycle_stats(cycles)
    }
