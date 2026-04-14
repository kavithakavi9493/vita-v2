from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from firebase_admin import firestore
from typing import Optional, List
from datetime import datetime
from middleware.auth import verify_token

router = APIRouter()

VALID_PLANS = {"basic", "advanced", "premium"}

PLAN_PRICES = {
    "basic":    1999,
    "advanced": 3999,
    "premium":  9999,
}

PLAN_DEFINITIONS = {
    "basic": {
        "id": "basic",
        "name": "Basic Plan",
        "duration": "1 Month",
        "price": 1999,
        "original": 2999,
        "features": [
            "Complete product recommendation (quiz-based)",
            "Progress tracking dashboard",
            "Weekly group session invitations (free)",
            "One-time expert consultation (your choice)",
            "WhatsApp chat support (9AM-9PM)",
            "Free home delivery",
        ],
        "notIncluded": ["Monthly body checkup", "4 experts/week"],
    },
    "advanced": {
        "id": "advanced",
        "name": "Advanced Plan",
        "duration": "1 Month",
        "price": 3999,
        "original": 5999,
        "features": [
            "All Basic plan features",
            "Free full body checkup every month",
            "4 expert consultations every week",
            "Free personalised diet plans",
            "Priority WhatsApp support",
            "Advanced VI dashboard access",
            "Free priority delivery",
        ],
        "notIncluded": [],
    },
    "premium": {
        "id": "premium",
        "name": "Premium Plan",
        "duration": "3 Months (3,333/month)",
        "price": 9999,
        "original": 14999,
        "features": [
            "All Advanced plan features",
            "Monthly full body checkup",
            "Weekly personal expert coach",
            "Advanced formulas developed specifically for you",
            "Dedicated 1:1 health coach",
            "Monthly progress review & plan adjustment",
            "Express priority delivery",
            "Lifetime VI app access",
        ],
        "notIncluded": [],
    },
}


class PlanUpdate(BaseModel):
    name:        Optional[str]       = None
    duration:    Optional[str]       = None
    price:       Optional[int]       = None
    original:    Optional[int]       = None
    features:    Optional[List[str]] = None
    notIncluded: Optional[List[str]] = None
    isActive:    Optional[bool]      = None


@router.get("/")
def get_all_plans():
    plans = [PLAN_DEFINITIONS["basic"], PLAN_DEFINITIONS["advanced"], PLAN_DEFINITIONS["premium"]]
    return {"plans": plans}


@router.get("/verify-price")
def verify_plan_price(planId: str, amount: int):
    plan_id = planId.lower()
    if plan_id not in PLAN_PRICES:
        raise HTTPException(status_code=404, detail=f"Unknown plan '{planId}'")
    expected = PLAN_PRICES[plan_id]
    if amount != expected:
        raise HTTPException(status_code=400, detail=f"Price mismatch for '{plan_id}'. Expected {expected}, received {amount}.")
    return {"valid": True, "planId": plan_id, "amount": expected, "amountPaise": expected * 100}


@router.get("/user/{user_id}/active")
def get_user_active_plan(user_id: str, current_user: dict = Depends(verify_token)):
    if current_user.get("uid") != user_id and not current_user.get("dev"):
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        db = firestore.client()
        subs = (
            db.collection("subscriptions")
            .where("userId", "==", user_id)
            .where("status", "==", "active")
            .stream()
        )
        active_subs = []
        now = datetime.utcnow().isoformat()
        for s in subs:
            data = s.to_dict()
            active_subs.append({"id": s.id, "isExpired": data.get("endDate", "") < now, **data})
        if not active_subs:
            return {"hasActivePlan": False, "subscription": None}
        active_subs.sort(key=lambda s: s.get("startDate", ""), reverse=True)
        latest = active_subs[0]
        is_expired = latest.get("isExpired", True)
        return {"hasActivePlan": not is_expired, "isExpired": is_expired, "subscription": latest}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{plan_id}")
def get_plan(plan_id: str):
    plan_id = plan_id.lower()
    if plan_id not in VALID_PLANS:
        raise HTTPException(status_code=404, detail=f"Plan '{plan_id}' not found")
    return PLAN_DEFINITIONS[plan_id]


@router.put("/{plan_id}")
def update_plan(plan_id: str, body: PlanUpdate, _: dict = Depends(verify_token)):
    plan_id = plan_id.lower()
    if plan_id not in VALID_PLANS:
        raise HTTPException(status_code=404, detail=f"Plan '{plan_id}' not found")
    try:
        db = firestore.client()
        ref = db.collection("plans").document(plan_id)
        updates = {k: v for k, v in body.dict().items() if v is not None}
        if not updates:
            raise HTTPException(status_code=400, detail="No fields provided to update")
        if "price" in updates:
            PLAN_PRICES[plan_id] = updates["price"]
            PLAN_DEFINITIONS[plan_id]["price"] = updates["price"]
        updates["updatedAt"] = datetime.utcnow().isoformat()
        ref.set({**PLAN_DEFINITIONS[plan_id], **updates}, merge=True)
        PLAN_DEFINITIONS[plan_id].update(updates)
        return {"id": plan_id, "updated": list(updates.keys())}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
