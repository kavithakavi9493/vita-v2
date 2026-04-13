from fastapi import APIRouter, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class ApplyCouponBody(BaseModel):
    code:   str
    userId: str
    amount: int

@router.get("/validate/{code}")
def validate_coupon(code: str):
    """Validate a coupon code and return discount info."""
    try:
        db  = firestore.client()
        doc = db.collection("coupons").document(code.upper()).get()

        if not doc.exists:
            return {"valid": False, "discount": 0, "message": "Invalid coupon code"}

        data = doc.to_dict()

        if not data.get("isActive", False):
            return {"valid": False, "discount": 0, "message": "Coupon is no longer active"}

        # Check expiry
        expires_at = data.get("expiresAt")
        if expires_at and datetime.utcnow().isoformat() > expires_at:
            return {"valid": False, "discount": 0, "message": "Coupon has expired"}

        return {
            "valid":    True,
            "discount": data.get("discount", 0),
            "type":     data.get("type", "flat"),   # flat or percent
            "message":  "Coupon applied successfully!",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/seed")
def seed_coupons():
    """Seed default coupons into Firestore (run once during setup)."""
    try:
        db = firestore.client()
        coupons = {
            "VI10": {"discount": 10, "type": "percent", "isActive": True, "expiresAt": "2025-12-31"},
            "VI20": {"discount": 20, "type": "percent", "isActive": True, "expiresAt": "2025-12-31"},
            "LAUNCH": {"discount": 500, "type": "flat", "isActive": True, "expiresAt": "2025-06-30"},
        }
        for code, data in coupons.items():
            db.collection("coupons").document(code).set(data)
        return {"seeded": list(coupons.keys())}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
