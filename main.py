"""
VI Firestore Seed Script — run once to set up all collections.
Usage: python seed_firestore.py
"""
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import os

cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def seed():
    print("🌱 Seeding Firestore collections...")

    # ─── 1. products ─────────────────────────────────────
    products = [
        { "id": "vajra_veerya",     "name": "Vajra Veerya",     "hindi": "वज्र वीर्य",      "category": "Testosterone Boost",  "price": 849,  "mrp": 1199, "active": True },
        { "id": "sthambhan_shakti", "name": "Sthambhan Shakti", "hindi": "स्थम्भन शक्ति",   "category": "Timing Control",      "price": 699,  "mrp": 999,  "active": True },
        { "id": "dridha_stambh",    "name": "Dridha Stambh",    "hindi": "दृढ स्तम्भ",       "category": "Erection Support",    "price": 779,  "mrp": 1099, "active": True },
        { "id": "manas_veerya",     "name": "Manas Veerya",     "hindi": "मनस् वीर्य",       "category": "Stress & Calm",       "price": 649,  "mrp": 899,  "active": True },
        { "id": "kaam_agni_ras",    "name": "Kaam Agni Ras",    "hindi": "काम अग्नि रस",     "category": "Pre-Intimacy Shots",  "price": 999,  "mrp": 1499, "active": True },
        { "id": "rasayana_shakti",  "name": "Rasayana Shakti",  "hindi": "रसायन शक्ति",      "category": "Night Recovery",      "price": 799,  "mrp": 1099, "active": True },
        { "id": "vajra_tailam",     "name": "Vajra Tailam",     "hindi": "वज्र तैलम्",        "category": "Performance Oil",     "price": 549,  "mrp": 799,  "active": True },
        { "id": "yuva_vajra",       "name": "Yuva Vajra",       "hindi": "युवा वज्र",          "category": "30+ Performance",    "price": 949,  "mrp": 1299, "active": True },
        { "id": "kaam_veerya",      "name": "Kaam Veerya",      "hindi": "काम वीर्य",          "category": "Libido Boost",       "price": 729,  "mrp": 999,  "active": True },
        { "id": "beej_shakti",      "name": "Beej Shakti",      "hindi": "बीज शक्ति",          "category": "Sperm Health",       "price": 849,  "mrp": 1199, "active": True },
        { "id": "maha_vajra",       "name": "Maha Vajra",       "hindi": "महावज्र",             "category": "Ultra Performance",  "price": 1499, "mrp": 1999, "active": True },
    ]
    for p in products:
        db.collection("products").document(p["id"]).set({**p, "updatedAt": datetime.utcnow().isoformat()})
    print(f"✅ {len(products)} products seeded")

    # ─── 2. plans ────────────────────────────────────────
    plans = [
        {
            "id": "basic", "name": "Basic Plan", "price": 1999, "duration": "1 month",
            "features": ["Product kit", "Progress tracking", "Weekly session invite", "1 expert consultation", "WhatsApp support"],
        },
        {
            "id": "advanced", "name": "Advanced Plan", "price": 3999, "duration": "1 month",
            "features": ["All Basic features", "Monthly body checkup", "4 expert consultations/week", "Free diet plan", "Priority support"],
        },
        {
            "id": "premium", "name": "Premium Plan", "price": 9999, "duration": "3 months",
            "features": ["All Advanced features", "Weekly personal expert", "Advanced custom formulas", "Dedicated health coach", "Lifetime app access"],
        },
    ]
    for p in plans:
        db.collection("plans").document(p["id"]).set(p)
    print(f"✅ {len(plans)} plans seeded")

    # ─── 3. coupons ──────────────────────────────────────
    coupons = [
        { "code": "VI20",    "discountPct": 20, "active": True, "usageLimit": 500,  "usedCount": 0 },
        { "code": "VI10",    "discountPct": 10, "active": True, "usageLimit": 1000, "usedCount": 0 },
        { "code": "WELCOME", "discountPct": 15, "active": True, "usageLimit": 200,  "usedCount": 0 },
        { "code": "SIDDHA",  "discountPct": 25, "active": True, "usageLimit": 100,  "usedCount": 0 },
    ]
    for c in coupons:
        db.collection("coupons").document(c["code"]).set(c)
    print(f"✅ {len(coupons)} coupons seeded")

    # ─── 4. quizMappings (body type → product stack) ─────
    quiz_mappings = {
        "HIGH_STRESS_LOW_VITALITY": {
            "label":      "High Stress / Low Vitality",
            "productIds": ["manas_veerya", "rasayana_shakti", "vajra_veerya", "kaam_agni_ras", "vajra_tailam"],
            "plan":       "advanced",
            "urgency":    "HIGH",
        },
        "HORMONAL_DECLINE": {
            "label":      "Hormonal Decline",
            "productIds": ["vajra_veerya", "kaam_veerya", "beej_shakti", "kaam_agni_ras", "rasayana_shakti"],
            "plan":       "advanced",
            "urgency":    "HIGH",
        },
        "PERFORMANCE_DEFICIT": {
            "label":      "Performance Deficit",
            "productIds": ["sthambhan_shakti", "dridha_stambh", "vajra_tailam", "vajra_veerya", "kaam_agni_ras"],
            "plan":       "advanced",
            "urgency":    "HIGH",
        },
        "AGE_RELATED_DROP": {
            "label":      "Age-Related Decline",
            "productIds": ["yuva_vajra", "vajra_veerya", "beej_shakti", "rasayana_shakti", "maha_vajra"],
            "plan":       "premium",
            "urgency":    "CRITICAL",
        },
        "PEAK_PERFORMANCE": {
            "label":      "Optimisation Mode",
            "productIds": ["vajra_veerya", "kaam_agni_ras", "vajra_tailam", "manas_veerya", "rasayana_shakti"],
            "plan":       "basic",
            "urgency":    "MODERATE",
        },
    }
    for key, val in quiz_mappings.items():
        db.collection("quizMappings").document(key).set(val)
    print(f"✅ {len(quiz_mappings)} quizMappings seeded")

    # ─── 5. Collection schema docs (structure reference) ─
    schemas = {
        "users": {
            "_description": "One doc per user. userId = Firebase Auth UID",
            "fields": ["userId", "userName", "phone", "email", "createdAt", "hasCompletedQuiz", "hasActivePlan", "planType", "planExpiry"],
        },
        "quizResults": {
            "_description": "Quiz answers + scores + body type per user. Updated progressively during quiz.",
            "fields": ["userId", "ageGroup", "energyLevel", "workoutLevel", "fatigueLevel", "stressLevel", "anxietyLevel", "focusLevel", "libidoLevel", "timingControl", "erectionQuality", "lifestyleScore", "physicalScore", "mentalScore", "performanceScore", "vitaScore", "bodyTypeId", "recommendedPlan", "hasCompletedQuiz", "updatedAt"],
        },
        "orders": {
            "_description": "One doc per order placed",
            "fields": ["userId", "planType", "amount", "products", "bodyTypeId", "recommendedPlan", "status", "shipping", "paymentId", "razorpayOrderId", "createdAt", "paidAt"],
        },
        "subscriptions": {
            "_description": "Active plan subscription per user",
            "fields": ["userId", "plan", "status", "orderId", "startDate", "endDate", "paymentId", "createdAt"],
        },
        "consultations": {
            "_description": "Expert consultation bookings",
            "fields": ["userId", "expertType", "expertName", "scheduledAt", "status", "meetLink", "planType", "notes", "createdAt"],
        },
        "whatsappQueue": {
            "_description": "Scheduled WhatsApp retention messages (Day 3, 7, 15)",
            "fields": ["userId", "orderId", "day3SendAt", "day7SendAt", "day15SendAt", "status", "createdAt"],
        },
        "progress": {
            "_description": "Daily progress logs — subcollection under users/{userId}/progress/{date}",
            "fields": ["date", "tookCapsules", "energyLevel", "performanceRating", "notes", "loggedAt"],
        },
    }
    for coll, schema in schemas.items():
        db.collection("_schemas").document(coll).set(schema)
    print(f"✅ {len(schemas)} collection schemas documented")

    print("\n🎉 Firestore seeding complete!")
    print("Collections created: products, plans, coupons, quizMappings, _schemas")
    print("Runtime collections (created on use): users, quizResults, orders, subscriptions, consultations, whatsappQueue, progress")

if __name__ == "__main__":
    seed()
