from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from firebase_admin import firestore
from typing import Optional, List
from datetime import datetime
from middleware.auth import verify_token

router = APIRouter()

class ShippingInfo(BaseModel):
    name:         str
    phone:        str
    addressLine1: str
    addressLine2: Optional[str] = ""
    city:         str
    state:        str
    pincode:      str

class CreateOrderBody(BaseModel):
    userId:   str
    planType: str
    amount:   int
    products: List[str] = []
    shipping: ShippingInfo
    bodyTypeId:      Optional[str] = ""
    recommendedPlan: Optional[str] = ""

@router.post("/create")
def create_order(body: CreateOrderBody, current_user: dict = Depends(verify_token)):
    # Ensure user can only create orders for themselves
    if current_user.get("uid") != body.userId and not current_user.get("dev"):
        raise HTTPException(status_code=403, detail="Forbidden: user mismatch")
    try:
        db  = firestore.client()
        ref = db.collection("orders").document()
        ref.set({
            "userId":          body.userId,
            "planType":        body.planType,
            "amount":          body.amount,
            "products":        body.products,
            "bodyTypeId":      body.bodyTypeId,
            "recommendedPlan": body.recommendedPlan,
            "status":          "pending",
            "shipping":        body.shipping.dict(),
            "createdAt":       datetime.utcnow().isoformat(),
        })
        # Also create subscription record
        sub_ref = db.collection("subscriptions").document()
        sub_ref.set({
            "userId":    body.userId,
            "plan":      body.planType,
            "status":    "pending_payment",
            "orderId":   ref.id,
            "startDate": None,
            "endDate":   None,
            "createdAt": datetime.utcnow().isoformat(),
        })
        return {"orderId": ref.id, "subscriptionId": sub_ref.id, "status": "created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}")
def get_user_orders(user_id: str, current_user: dict = Depends(verify_token)):
    if current_user.get("uid") != user_id and not current_user.get("dev"):
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        db   = firestore.client()
        docs = db.collection("orders").where("userId", "==", user_id).stream()
        return {"orders": [{"id": d.id, **d.to_dict()} for d in docs]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/detail/{order_id}")
def get_order(order_id: str, current_user: dict = Depends(verify_token)):
    try:
        db  = firestore.client()
        doc = db.collection("orders").document(order_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Order not found")
        data = doc.to_dict()
        # Auth check — only the owner or admin
        if current_user.get("uid") != data.get("userId") and not current_user.get("dev"):
            raise HTTPException(status_code=403, detail="Forbidden")
        return {"id": doc.id, **data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
