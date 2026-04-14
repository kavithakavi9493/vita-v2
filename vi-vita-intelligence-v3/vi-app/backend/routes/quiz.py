import logging
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from firebase_admin import firestore
from typing import Optional
from datetime import datetime
from middleware.auth import verify_token

router = APIRouter()
logger = logging.getLogger("vi-api")

COLLECTION = "user_responses"

SCORE_MAP = {
    "energyLevel":     {"High": 10, "Medium": 6, "Low": 3},
    "workoutLevel":    {"Yes": 10, "Sometimes": 5, "No": 2},
    "fatigueLevel":    {"Rarely": 5, "Sometimes": 3, "Frequently": 2},
    "stressLevel":     {"Low": 10, "Moderate": 6, "High": 2},
    "anxietyLevel":    {"No": 10, "Sometimes": 5, "Often": 2},
    "focusLevel":      {"Good": 5, "Average": 3, "Poor": 2},
    "libidoLevel":     {"High": 10, "Moderate": 6, "Low": 3},
    "timingControl":   {"No": 10, "Sometimes": 6, "Often": 2},
    "erectionQuality": {"Strong": 5, "Moderate": 3, "Weak": 2},
}

AGE_DEDUCTION = {"36-45": 2, "45+": 4}


def _score(field: str, value: str) -> float:
    return SCORE_MAP.get(field, {}).get(value, 0)


def compute_scores(q: dict) -> dict:
    physical_score = (
        _score("energyLevel", q.get("energyLevel", "")) +
        _score("workoutLevel", q.get("workoutLevel", "")) +
        _score("fatigueLevel", q.get("fatigueLevel", ""))
    )
    mental_score = (
        _score("stressLevel", q.get("stressLevel", "")) +
        _score("anxietyLevel", q.get("anxietyLevel", "")) +
        _score("focusLevel", q.get("focusLevel", ""))
    )
    perf_score = (
        _score("libidoLevel", q.get("libidoLevel", "")) +
        _score("timingControl", q.get("timingControl", "")) +
        _score("erectionQuality", q.get("erectionQuality", ""))
    )
    lifestyle_score = float(q.get("lifestyleScore", 0))
    age_group = q.get("ageGroup", "")
    deduction = AGE_DEDUCTION.get(age_group, 0)
    vita_score = lifestyle_score + physical_score + mental_score + perf_score - deduction
    vita_score = max(0, min(100, vita_score))
    return {
        "lifestyleScore":   round(lifestyle_score, 1),
        "physicalScore":    round(physical_score, 1),
        "mentalScore":      round(mental_score, 1),
        "performanceScore": round(perf_score, 1),
        "vitaScore":        round(vita_score, 1),
    }


def server_detect_body_type(quiz: dict, scores: dict) -> str:
    age_group   = quiz.get("ageGroup", "")
    mental      = scores["mentalScore"]
    lifestyle   = scores["lifestyleScore"]
    physical    = scores["physicalScore"]
    performance = scores["performanceScore"]
    vita        = scores["vitaScore"]
    stress      = quiz.get("stressLevel", "")
    anxiety     = quiz.get("anxietyLevel", "")
    fatigue     = quiz.get("fatigueLevel", "")
    libido      = quiz.get("libidoLevel", "")
    timing      = quiz.get("timingControl", "")
    erection    = quiz.get("erectionQuality", "")

    if age_group in ("36-45", "45+"):
        return "AGE_RELATED_DROP"

    stress_indicators = sum([mental < 10, lifestyle < 10, stress == "High", anxiety == "Often", fatigue == "Frequently"])
    if stress_indicators >= 3:
        return "HIGH_STRESS_LOW_VITALITY"

    perf_indicators = sum([performance < 10, timing in ("Often", "Sometimes"), erection in ("Weak", "Moderate")])
    if perf_indicators >= 2:
        return "PERFORMANCE_DEFICIT"

    hormonal_indicators = sum([physical < 10, libido == "Low", vita < 55, mental < 12 and performance < 12])
    if hormonal_indicators >= 2:
        return "HORMONAL_DECLINE"

    return "PEAK_PERFORMANCE"


class QuizSaveBody(BaseModel):
    userId:          str
    ageGroup:        Optional[str] = None
    wakeTime:        Optional[str] = None
    breakfastTime:   Optional[str] = None
    lunchTime:       Optional[str] = None
    dinnerTime:      Optional[str] = None
    sleepTime:       Optional[str] = None
    energyLevel:     Optional[str] = None
    workoutLevel:    Optional[str] = None
    fatigueLevel:    Optional[str] = None
    stressLevel:     Optional[str] = None
    anxietyLevel:    Optional[str] = None
    focusLevel:      Optional[str] = None
    libidoLevel:     Optional[str] = None
    timingControl:   Optional[str] = None
    erectionQuality: Optional[str] = None
    lifestyleScore:   Optional[float] = None
    physicalScore:    Optional[float] = None
    mentalScore:      Optional[float] = None
    performanceScore: Optional[float] = None
    vitaScore:        Optional[float] = None
    bodyTypeId:      Optional[str] = None
    recommendedPlan: Optional[str] = None


class QuizCompleteBody(BaseModel):
    userId:           str
    bodyTypeId:       str
    recommendedPlan:  str
    vitaScore:        float
    lifestyleScore:   float
    physicalScore:    float
    mentalScore:      float
    performanceScore: float


@router.post("/save")
def save_quiz(body: QuizSaveBody, current_user: dict = Depends(verify_token)):
    if current_user.get("uid") != body.userId and not current_user.get("dev"):
        raise HTTPException(status_code=403, detail="Forbidden: user mismatch")
    try:
        db = firestore.client()
        ref = db.collection(COLLECTION).document(body.userId)
        updates = {k: v for k, v in body.dict().items() if v is not None and k != "userId"}
        if not updates:
            return {"status": "no_changes"}
        updates["userId"] = body.userId
        updates["updatedAt"] = datetime.utcnow().isoformat()
        ref.set(updates, merge=True)
        return {"status": "saved", "fields": list(updates.keys())}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/complete")
def complete_quiz(body: QuizCompleteBody, current_user: dict = Depends(verify_token)):
    if current_user.get("uid") != body.userId and not current_user.get("dev"):
        raise HTTPException(status_code=403, detail="Forbidden: user mismatch")
    try:
        db = firestore.client()
        saved_doc = db.collection(COLLECTION).document(body.userId).get()
        saved_data = saved_doc.to_dict() if saved_doc.exists else {}
        server_scores = compute_scores(saved_data)
        server_body_type = server_detect_body_type(saved_data, server_scores)
        vita_diff = abs(body.vitaScore - server_scores["vitaScore"])
        if vita_diff > 10:
            logger.warning(f"VitaScore mismatch userId={body.userId} frontend={body.vitaScore} server={server_scores['vitaScore']}")
        final = {
            "userId":           body.userId,
            "bodyTypeId":       server_body_type,
            "recommendedPlan":  body.recommendedPlan,
            "lifestyleScore":   server_scores["lifestyleScore"],
            "physicalScore":    server_scores["physicalScore"],
            "mentalScore":      server_scores["mentalScore"],
            "performanceScore": server_scores["performanceScore"],
            "vitaScore":        server_scores["vitaScore"],
            "hasCompletedQuiz": True,
            "completedAt":      datetime.utcnow().isoformat(),
            "updatedAt":        datetime.utcnow().isoformat(),
        }
        db.collection(COLLECTION).document(body.userId).set(final, merge=True)
        db.collection("users").document(body.userId).set({
            "hasCompletedQuiz": True,
            "bodyTypeId":       server_body_type,
            "recommendedPlan":  body.recommendedPlan,
            "vitaScore":        server_scores["vitaScore"],
            "updatedAt":        datetime.utcnow().isoformat(),
        }, merge=True)
        return {"status": "quiz_complete", "bodyTypeId": server_body_type, "recommendedPlan": body.recommendedPlan, "scores": server_scores}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/mappings")
def get_quiz_mappings():
    try:
        db = firestore.client()
        docs = db.collection("quizMappings").stream()
        mappings = {d.id: d.to_dict() for d in docs}
        return {"mappings": mappings, "count": len(mappings)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}")
def get_quiz_result(user_id: str, current_user: dict = Depends(verify_token)):
    if current_user.get("uid") != user_id and not current_user.get("dev"):
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        db = firestore.client()
        doc = db.collection(COLLECTION).document(user_id).get()
        if not doc.exists:
            return {"hasData": False, "quizResult": None}
        return {"hasData": True, "quizResult": doc.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{user_id}/reset")
def reset_quiz(user_id: str, current_user: dict = Depends(verify_token)):
    if current_user.get("uid") != user_id and not current_user.get("dev"):
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        db = firestore.client()
        db.collection(COLLECTION).document(user_id).delete()
        db.collection("users").document(user_id).set({
            "hasCompletedQuiz": False,
            "bodyTypeId":       "",
            "recommendedPlan":  "",
            "vitaScore":        0,
            "updatedAt":        datetime.utcnow().isoformat(),
        }, merge=True)
        return {"status": "reset", "userId": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
