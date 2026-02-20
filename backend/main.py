from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_db, close_db
from routers import auth, cycles, symptoms, predictions, dashboard, reminders
import uvicorn

app = FastAPI(
    title="MyCare API",
    description="Backend for MyCare Period Cycle Tracker",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lifecycle events
@app.on_event("startup")
async def startup_db_client():
    await connect_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_db()

# Include Routers
app.include_router(auth.router)
app.include_router(cycles.router)
app.include_router(symptoms.router)
app.include_router(predictions.router)
app.include_router(dashboard.router)
app.include_router(reminders.router)

@app.get("/")
async def root():
    return {"message": "Welcome to MyCare API", "status": "running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
