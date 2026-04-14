"""
Products route - VI Vita Intelligence (v3 screens)
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from firebase_admin import firestore
from typing import Optional, List
from datetime import datetime
from middleware.auth import verify_token

router = APIRouter()

PRODUCT_CATALOGUE = [
    {"id": 1, "icon": "💊", "brand": "Vajra Veerya", "hindi": "वज्र वीर्य", "cat": "Testosterone Boost", "mrp": 1199, "price": 849, "benefits": ["Testosterone Rise", "Energy Surge", "Muscle Strength"], "ingredients": "Ashwagandha, Shilajit, Safed Musli, Gokshura, Kapikacchu", "usage": "2 capsules daily after breakfast", "rating": 4.9, "reviews": 3241, "active": True},
    {"id": 2, "icon": "⏱️", "brand": "Sthambhan Shakti", "hindi": "स्थम्भन शक्ति", "cat": "Timing Control", "mrp": 999, "price": 699, "benefits": ["Better Control", "Longer Duration", "Confidence"], "ingredients": "Jaiphal, Akarkara, Vidari Kanda, Ashwagandha, Shatavari", "usage": "2 capsules 1 hour before activity", "rating": 4.8, "reviews": 2847, "active": True},
    {"id": 3, "icon": "🔥", "brand": "Dridha Stambh", "hindi": "दृढ स्तम्भ", "cat": "Erection Support", "mrp": 1099, "price": 779, "benefits": ["Stronger Erection", "Blood Flow", "Vascular Health"], "ingredients": "Vidarikanda, Kaunch Beej, Gokshura, Swarna Bhasma, Shilajit", "usage": "2 capsules after dinner with warm milk", "rating": 4.8, "reviews": 2103, "active": True},
    {"id": 4, "icon": "🧠", "brand": "Manas Veerya", "hindi": "मनस् वीर्य", "cat": "Stress & Calm", "mrp": 899, "price": 649, "benefits": ["Calm Mind", "Cortisol Control", "Focus & Sleep"], "ingredients": "Brahmi, Ashwagandha, Jatamansi, L-Theanine, Magnesium", "usage": "1 capsule morning + 1 at night", "rating": 4.8, "reviews": 1654, "active": True},
    {"id": 5, "icon": "⚡", "brand": "Kaam Agni Ras", "hindi": "काम अग्नि रस", "cat": "Pre-Intimacy Shots", "mrp": 1499, "price": 999, "benefits": ["Instant Ignition", "Fast Absorb", "Passion Boost"], "ingredients": "Saffron, Shilajit Extract, Zinc, Ginseng, Vitamin B12, Honey Base", "usage": "1 shot 30 minutes before activity", "rating": 4.9, "reviews": 3102, "active": True},
    {"id": 6, "icon": "🌿", "brand": "Rasayana Shakti", "hindi": "रसायन शक्ति", "cat": "Night Recovery", "mrp": 1099, "price": 799, "benefits": ["Deep Sleep", "Hormone Repair", "Morning Energy"], "ingredients": "Magnesium Glycinate, Tart Cherry, L-Glycine, Zinc, Ashwagandha, Melatonin 0.5mg", "usage": "1 scoop in warm water before bed", "rating": 4.7, "reviews": 1287, "active": True},
    {"id": 7, "icon": "🛢️", "brand": "Vajra Tailam", "hindi": "वज्र तैलम्", "cat": "Performance Oil", "mrp": 799, "price": 549, "benefits": ["Fast Absorption", "Blood Flow", "Enhanced Sensitivity"], "ingredients": "Nirgundi Oil, Akarkara, Clove Extract, Sesame Base, Camphor", "usage": "Apply gently 15 minutes before activity", "rating": 4.7, "reviews": 1923, "active": True},
    {"id": 8, "icon": "💪", "brand": "Yuva Vajra", "hindi": "युवा वज्र", "cat": "30+ Performance", "mrp": 1299, "price": 949, "benefits": ["Age Reversal Formula", "Testosterone Restore", "Energy & Drive"], "ingredients": "Shilajit Resin, Safed Musli, Ashwagandha, Shatavari, Swarna Makshik Bhasma", "usage": "2 capsules morning with warm milk", "rating": 4.9, "reviews": 2567, "active": True},
    {"id": 9, "icon": "🔥", "brand": "Kaam Veerya", "hindi": "काम वीर्य", "cat": "Libido Boost", "mrp": 999, "price": 729, "benefits": ["Reignite Desire", "Hormonal Balance", "Vitality"], "ingredients": "Kapikacchu, Shatavari, Gokshura, Safed Musli, Ras Sindoor, Clove", "usage": "2 capsules after dinner", "rating": 4.8, "reviews": 2198, "active": True},
    {"id": 10, "icon": "🧬", "brand": "Beej Shakti", "hindi": "बीज शक्ति", "cat": "Sperm Health", "mrp": 1199, "price": 849, "benefits": ["Sperm Count", "Motility", "Reproductive Vitality"], "ingredients": "Ashwagandha, Shatavari, Kapikacchu, Zinc, Selenium, Gokshura, Vidarikanda", "usage": "2 capsules daily after breakfast", "rating": 4.7, "reviews": 1432, "active": True},
    {"id": 11, "icon": "👑", "brand": "Maha Vajra", "hindi": "महावज्र", "cat": "Ultra Performance", "mrp": 1999, "price": 1499, "benefits": ["Maximum Potency Formula", "All-in-one Power", "Premium Results"], "ingredients": "Shilajit Resin 500mg, Swarna Bhasma, Ashwagandha KSM-66, Safed Musli, Gokshura, Kapikacchu, Saffron", "usage": "1 capsule morning + 1 at night with warm milk", "rating": 5.0, "reviews": 987, "active": True},
]


def _show_product(product_id: int, s: dict, age_group: str, plan_type: str) -> bool:
    perf  = s.get("performanceScore", 0)
    ment  = s.get("mentalScore", 0)
    life  = s.get("lifestyleScore", 0)
    phys  = s.get("physicalScore", 0)
    vita  = s.get("vitaScore", 0)
    libid = s.get("libidoLevel", "")
    time  = s.get("timingControl", "")
    erect = s.get("erectionQuality", "")
    strss = s.get("stressLevel", "")
    anx   = s.get("anxietyLevel", "")
    fatig = s.get("fatigueLevel", "")
    age36 = age_group in ("36-45", "45+")
    rules = {
        1:  lambda: perf < 15 or libid == "Low" or age36,
        2:  lambda: time in ("Sometimes", "Often") or perf < 15,
        3:  lambda: erect in ("Moderate", "Weak") or perf < 15,
        4:  lambda: ment < 15 or strss == "High" or anx == "Often",
        5:  lambda: libid in ("Low", "Moderate") or perf < 15,
        6:  lambda: life < 15 or fatig == "Frequently",
        7:  lambda: perf < 15 or erect != "Strong",
        8:  lambda: age36,
        9:  lambda: libid == "Low" or perf < 15,
        10: lambda: phys < 15 or age36,
        11: lambda: vita < 50 or plan_type == "premium",
    }
    fn = rules.get(product_id)
    return bool(fn()) if fn else False


def _get_recommended(s: dict, age_group: str, plan_type: str) -> list:
    limit = {"premium": 7, "advanced": 5, "basic": 3}.get(plan_type, 3)
    matched = [p for p in PRODUCT_CATALOGUE if p["active"] and _show_product(p["id"], s, age_group, plan_type)]
    result = matched[:limit]
    if len(result) < 2:
        extras = [p for p in PRODUCT_CATALOGUE if p["active"] and p not in result][: 2 - len(result)]
        result = result + extras
    return result


class ProductUpsert(BaseModel):
    id:          int
    icon:        Optional[str]       = ""
    brand:       str
    hindi:       Optional[str]       = ""
    cat:         str
    mrp:         int
    price:       int
    benefits:    Optional[List[str]] = []
    ingredients: Optional[str]       = ""
    usage:       Optional[str]       = ""
    rating:      Optional[float]     = 0.0
    reviews:     Optional[int]       = 0
    active:      Optional[bool]      = True


class ProductUpdate(BaseModel):
    icon:        Optional[str]       = None
    brand:       Optional[str]       = None
    hindi:       Optional[str]       = None
    cat:         Optional[str]       = None
    mrp:         Optional[int]       = None
    price:       Optional[int]       = None
    benefits:    Optional[List[str]] = None
    ingredients: Optional[str]       = None
    usage:       Optional[str]       = None
    rating:      Optional[float]     = None
    reviews:     Optional[int]       = None
    active:      Optional[bool]      = None


@router.get("/recommend")
def get_recommended_stack(
    ageGroup:         str   = "18-25",
    planType:         str   = "advanced",
    performanceScore: float = 0,
    mentalScore:      float = 0,
    lifestyleScore:   float = 0,
    physicalScore:    float = 0,
    vitaScore:        float = 0,
    libidoLevel:      str   = "",
    timingControl:    str   = "",
    erectionQuality:  str   = "",
    stressLevel:      str   = "",
    anxietyLevel:     str   = "",
    fatigueLevel:     str   = "",
):
    state = {
        "performanceScore": performanceScore,
        "mentalScore":      mentalScore,
        "lifestyleScore":   lifestyleScore,
        "physicalScore":    physicalScore,
        "vitaScore":        vitaScore,
        "libidoLevel":      libidoLevel,
        "timingControl":    timingControl,
        "erectionQuality":  erectionQuality,
        "stressLevel":      stressLevel,
        "anxietyLevel":     anxietyLevel,
        "fatigueLevel":     fatigueLevel,
    }
    stack = _get_recommended(state, ageGroup, planType)
    return {"stack": stack, "count": len(stack), "planType": planType, "ageGroup": ageGroup}


@router.get("/")
def get_all_products():
    active = sorted([p for p in PRODUCT_CATALOGUE if p["active"]], key=lambda p: p["id"])
    return {"products": active, "count": len(active)}


@router.get("/{product_id}")
def get_product(product_id: int):
    match = next((p for p in PRODUCT_CATALOGUE if p["id"] == product_id), None)
    if not match:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
    return match


@router.post("/")
def upsert_product(body: ProductUpsert, _: dict = Depends(verify_token)):
    try:
        db   = firestore.client()
        data = {**body.dict(), "updatedAt": datetime.utcnow().isoformat()}
        db.collection("products").document(str(body.id)).set(data)
        for i, p in enumerate(PRODUCT_CATALOGUE):
            if p["id"] == body.id:
                PRODUCT_CATALOGUE[i] = {**data}
                break
        return {"id": body.id, "status": "upserted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{product_id}")
def update_product(product_id: int, body: ProductUpdate, _: dict = Depends(verify_token)):
    match = next((p for p in PRODUCT_CATALOGUE if p["id"] == product_id), None)
    if not match:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
    try:
        updates = {k: v for k, v in body.dict().items() if v is not None}
        if not updates:
            raise HTTPException(status_code=400, detail="No fields provided")
        updates["updatedAt"] = datetime.utcnow().isoformat()
        db = firestore.client()
        db.collection("products").document(str(product_id)).set({**match, **updates}, merge=True)
        for i, p in enumerate(PRODUCT_CATALOGUE):
            if p["id"] == product_id:
                PRODUCT_CATALOGUE[i] = {**p, **updates}
                break
        return {"id": product_id, "updated": list(updates.keys())}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{product_id}")
def deactivate_product(product_id: int, _: dict = Depends(verify_token)):
    match = next((p for p in PRODUCT_CATALOGUE if p["id"] == product_id), None)
    if not match:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
    try:
        db = firestore.client()
        db.collection("products").document(str(product_id)).set(
            {**match, "active": False, "updatedAt": datetime.utcnow().isoformat()}, merge=True
        )
        for i, p in enumerate(PRODUCT_CATALOGUE):
            if p["id"] == product_id:
                PRODUCT_CATALOGUE[i]["active"] = False
                break
        return {"id": product_id, "status": "deactivated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
list