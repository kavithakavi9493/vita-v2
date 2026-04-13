import os, logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials

load_dotenv()

# ── Logging ──────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("vi-api")

# ── Firebase Admin init ──────────────────────────────────
cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")
if os.path.exists(cred_path):
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    logger.info("✅ Firebase Admin initialised")
else:
    logger.warning("⚠️  serviceAccountKey.json not found — Firestore disabled")

# ── App ──────────────────────────────────────────────────
app = FastAPI(
    title="VI — Vita Intelligence API",
    description="Backend for VI men's health platform. All protected routes require Firebase Bearer token.",
    version="2.0.0",
)

# ── CORS ─────────────────────────────────────────────────
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request logging middleware ────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"→ {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"← {response.status_code} {request.url.path}")
    return response

# ── Global error handler ─────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

# ── Routers ──────────────────────────────────────────────
from routes.payments import router as payments_router
from routes.orders   import router as orders_router
from routes.coupons  import router as coupons_router

app.include_router(payments_router, prefix="/api/payments", tags=["Payments"])
app.include_router(orders_router,   prefix="/api/orders",   tags=["Orders"])
app.include_router(coupons_router,  prefix="/api/coupons",  tags=["Coupons"])

# ── Health check ─────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "online", "app": "VI — Vita Intelligence API", "version": "2.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
