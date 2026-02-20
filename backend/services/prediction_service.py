from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any


def calculate_cycle_stats(cycles: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate average cycle length and period duration from history."""
    if not cycles:
        return {"average_cycle_length": 28, "average_period_length": 5}

    history = []
    cycle_lengths = []
    period_lengths = []

    sorted_cycles = sorted(cycles, key=lambda c: c["start_date"])

    for i, cycle in enumerate(sorted_cycles):
        duration = None
        if cycle.get("end_date"):
            try:
                start = datetime.strptime(cycle["start_date"], "%Y-%m-%d")
                end = datetime.strptime(cycle["end_date"], "%Y-%m-%d")
                duration = (end - start).days + 1
                if 1 <= duration <= 14:
                    period_lengths.append(duration)
            except Exception:
                pass

        gap = None
        if i > 0:
            try:
                prev_start = datetime.strptime(sorted_cycles[i - 1]["start_date"], "%Y-%m-%d")
                curr_start = datetime.strptime(cycle["start_date"], "%Y-%m-%d")
                gap = (curr_start - prev_start).days
                if 15 <= gap <= 60:
                    cycle_lengths.append(gap)
            except Exception:
                pass
        
        history.append({
            "date": cycle["start_date"],
            "length": gap,
            "duration": duration
        })

    avg_cycle = round(sum(cycle_lengths) / len(cycle_lengths)) if cycle_lengths else 28
    avg_period = round(sum(period_lengths) / len(period_lengths)) if period_lengths else 5

    return {
        "average_cycle_length": avg_cycle,
        "average_period_length": avg_period,
        "cycle_count": len(cycles),
        "history": history
    }


def predict_next_period(
    cycles: List[Dict[str, Any]],
    user_avg_cycle: int = 28,
    user_avg_period: int = 5,
) -> Dict[str, Any]:
    """Predict next period start date, ovulation window, and fertile window."""
    stats = calculate_cycle_stats(cycles)
    avg_cycle = stats.get("average_cycle_length", user_avg_cycle)
    avg_period = stats.get("average_period_length", user_avg_period)

    if not cycles:
        return {
            "next_period_date": None,
            "ovulation_date": None,
            "fertile_window_start": None,
            "fertile_window_end": None,
            "luteal_phase_start": None,
            "days_until_next_period": None,
            "current_cycle_day": None,
            "current_phase": "unknown",
        }

    sorted_cycles = sorted(cycles, key=lambda c: c["start_date"], reverse=True)
    last_start = datetime.strptime(sorted_cycles[0]["start_date"], "%Y-%m-%d")

    next_period = last_start + timedelta(days=avg_cycle)
    ovulation = next_period - timedelta(days=14)
    fertile_start = ovulation - timedelta(days=5)
    fertile_end = ovulation + timedelta(days=1)
    luteal_start = ovulation + timedelta(days=2)

    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    days_until = (next_period - today).days
    current_cycle_day = (today - last_start).days + 1

    # Determine current phase, tips, and hormone levels
    if current_cycle_day <= avg_period:
        phase = "menstruation"
        hormones = {"estrogen": "low", "progesterone": "low", "testosterone": "low"}
        tips = [
            "Rest and sleep are your best friends right now.",
            "Eat iron-rich foods like spinach and lean meats.",
            "Try gentle stretches or yoga for cramp relief."
        ]
    elif current_cycle_day <= (avg_cycle // 2) - 5:
        phase = "follicular"
        hormones = {"estrogen": "rising", "progesterone": "low", "testosterone": "steady"}
        tips = [
            "Your energy is rising! Great time for new projects.",
            "Try high-intensity workouts if you feel up to it.",
            "Eat fermented foods to support gut health."
        ]
    elif current_cycle_day <= (avg_cycle // 2) + 1:
        phase = "ovulation"
        hormones = {"estrogen": "high", "progesterone": "low", "testosterone": "peak"}
        tips = [
            "You're at your peak! You might feel more social.",
            "Focus on anti-inflammatory foods like berries.",
            "Keep an eye out for changes in cervical discharge."
        ]
    elif current_cycle_day <= avg_cycle - 1:
        phase = "luteal"
        hormones = {"estrogen": "steady", "progesterone": "rising", "testosterone": "low"}
        tips = [
            "Slow down and focus on self-care.",
            "Eat complex carbs to stabilize energy levels.",
            "Light cardio is better than intense workouts now."
        ]
    else:
        phase = "late_luteal"
        hormones = {"estrogen": "falling", "progesterone": "falling", "testosterone": "low"}
        tips = [
            "Drink plenty of water to reduce bloating.",
            "Limit caffeine and salt to manage PMS symptoms.",
            "Gentle walks can help improve your mood."
        ]

    # Calculate future cycles
    future_predictions = []
    current_proj_start = next_period
    for _ in range(6):
        proj_ovulation = current_proj_start + timedelta(days=avg_cycle // 2)
        future_predictions.append({
            "start_date": current_proj_start.strftime("%Y-%m-%d"),
            "end_date": (current_proj_start + timedelta(days=avg_period - 1)).strftime("%Y-%m-%d"),
            "ovulation_date": proj_ovulation.strftime("%Y-%m-%d")
        })
        current_proj_start += timedelta(days=avg_cycle)

    return {
        "next_period_date": next_period.strftime("%Y-%m-%d"),
        "ovulation_date": ovulation.strftime("%Y-%m-%d"),
        "fertile_window_start": fertile_start.strftime("%Y-%m-%d"),
        "fertile_window_end": fertile_end.strftime("%Y-%m-%d"),
        "luteal_phase_start": luteal_start.strftime("%Y-%m-%d"),
        "days_until_next_period": days_until,
        "current_cycle_day": current_cycle_day,
        "current_phase": phase,
        "hormone_levels": hormones,
        "phase_tips": tips,
        "average_cycle_length": avg_cycle,
        "average_period_length": avg_period,
        "future_predictions": future_predictions
    }
