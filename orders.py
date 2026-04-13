import os, hmac, hashlib
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from firebase_admin import firestore
from datetime import datetime, timedelta
from middleware.auth import verify_token

router = APIRouter()

RAZORPAY_KEY_ID     = os.getenv("RAZORPAY_KEY_ID",     "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET",  "")

PLAN_MONTHS = {"basic": 1, "advanced": 1, "premium": 3}

class InitiatePaymentBody(BaseModel):
    userId:   str
    orderId:  str
    amount:   int   # in paise (₹ × 100)
    planType: str

class VerifyPaymentBody(BaseModel):
    razorpayOrderId:   str
    razorpayPaymentId: str
    razorpaySignature: str
    orderId:           str
    userId:            str
    planType:          str

@router.post("/initiate")
def initiate_payment(body: InitiatePaymentBody, current_user: dict = Depends(verify_token)):
    if current_user.get("uid") != body.userId and not current_user.get("dev"):
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        import razorpay
        client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        order = client.order.create({
            "amount":   body.amount,
            "currency": "INR",
            "receipt":  body.orderId,
            "notes":    {"userId": body.userId, "planType": body.planType},
        })
        return {"razorpayOrderId": order["id"], "amount": body.amount, "currency": "INR"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
def verify_payment(body: VerifyPaymentBody, current_user: dict = Depends(verify_token)):
    if current_user.get("uid") != body.userId and not current_user.get("dev"):
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        # Verify Razorpay signature
        if RAZORPAY_KEY_SECRET:
            message = f"{body.razorpayOrderId}|{body.razorpayPaymentId}"
            expected = hmac.new(
                RAZORPAY_KEY_SECRET.encode(), message.encode(), hashlib.sha256
            ).hexdigest()
            if expected != body.razorpaySignature:
                raise HTTPException(status_code=400, detail="Payment signature mismatch")

        db = firestore.client()

        # Update order status
        db.collection("orders").document(body.orderId).update({
            "status":          "paid",
            "paymentId":       body.razorpayPaymentId,
            "razorpayOrderId": body.razorpayOrderId,
            "paidAt":          datetime.utcnow().isoformat(),
        })

        # Activate subscription
        months = PLAN_MONTHS.get(body.planType, 1)
        start  = datetime.utcnow()
        end    = start + timedelta(days=30 * months)

        subs = db.collection("subscriptions").where("orderId", "==", body.orderId).stream()
        for sub in subs:
            sub.reference.update({
                "status":    "active",
                "startDate": start.isoformat(),
                "endDate":   end.isoformat(),
                "paymentId": body.razorpayPaymentId,
            })

        # Update user record
        db.collection("users").document(body.userId).update({
            "hasActivePlan": True,
            "planType":      body.planType,
            "planExpiry":    end.isoformat(),
        })

        # Schedule WhatsApp retention reminders (placeholder — trigger via Cloud Function)
        db.collection("whatsappQueue").add({
            "userId":      body.userId,
            "orderId":     body.orderId,
            "day3SendAt":  (start + timedelta(days=3)).isoformat(),
            "day7SendAt":  (start + timedelta(days=7)).isoformat(),
            "day15SendAt": (start + timedelta(days=15)).isoformat(),
            "status":      "pending",
            "createdAt":   datetime.utcnow().isoformat(),
        })

        return {
            "status":  "payment_verified",
            "orderId": body.orderId,
            "plan":    body.planType,
            "expiry":  end.isoformat(),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
