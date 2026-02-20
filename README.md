# MyCare — Period Cycle Tracker

A premium, mobile-first period and menstrual health tracker built with React (Vite), FastAPI, and MongoDB.

## Features

- 🔐 **Secure Auth**: JWT-based authentication.
- 📅 **Cycle Tracking**: Log your period start and end dates.
- 🩺 **Daily Symptoms**: Track mood, energy, and physical symptoms.
- 🔮 **Smart Predictions**: Forecast next period and ovulation windows.
- 📊 **Dashboard**: Real-time cycle phase and countdown.
- 📱 **Mobile-First**: Optimized for a sleek mobile application experience.

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3.9+
- MongoDB

### Local Setup

#### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker Setup
```bash
docker-compose up --build
```

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Recharts, Lucide React
- **Backend**: FastAPI, Motor (Async MongoDB), Pydantic
- **Database**: MongoDB
