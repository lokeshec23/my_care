from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from bson import ObjectId
from database import get_db
from models.user import UserRegister, UserLogin, Token, UserProfile, UserUpdateProfile
from services.auth_service import hash_password, verify_password, create_access_token
from dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


def user_to_profile(user: dict) -> UserProfile:
    return UserProfile(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        date_of_birth=user.get("date_of_birth"),
        age=user.get("age"),
        weight=user.get("weight"),
        height=user.get("height"),
        is_onboarded=user.get("is_onboarded", False),
        average_cycle_length=user.get("average_cycle_length", 28),
        average_period_length=user.get("average_period_length", 5),
        created_at=user.get("created_at", datetime.utcnow()),
    )


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister):
    db = get_db()
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    now = datetime.utcnow()
    new_user = {
        "name": data.name,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "date_of_birth": data.date_of_birth,
        "age": data.age,
        "weight": data.weight,
        "height": data.height,
        "is_onboarded": False,
        "average_cycle_length": data.average_cycle_length or 28,
        "average_period_length": data.average_period_length or 5,
        "created_at": now,
    }
    result = await db.users.insert_one(new_user)
    new_user["_id"] = result.inserted_id
    token = create_access_token({"sub": str(result.inserted_id)})
    return Token(access_token=token, user=user_to_profile(new_user))


@router.post("/login", response_model=Token)
async def login(data: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_access_token({"sub": str(user["_id"])})
    return Token(access_token=token, user=user_to_profile(user))


@router.put("/onboard", response_model=UserProfile)
async def onboard_user(data: UserUpdateProfile, current_user=Depends(get_current_user)):
    db = get_db()
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data["is_onboarded"] = True
    
    result = await db.users.find_one_and_update(
        {"_id": current_user["_id"]},
        {"$set": update_data},
        return_document=True,
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user_to_profile(result)
