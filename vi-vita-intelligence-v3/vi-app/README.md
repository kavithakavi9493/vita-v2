# VI — Vita Intelligence Platform v3.0

> Intelligent Vitality. Ancient Wisdom. — AI-powered men's wellness platform.

---

## Architecture

```
User → Quiz → Score Engine → Body Type → Product Stack → Social Proof → Checkout → Dashboard
```

## Frontend (React + Vite)

```
src/
├── utils/
│   └── recommendationEngine.js   ← Quiz → Body Type → Product Stack logic
├── screens/
│   ├── SplashScreen.jsx
│   ├── SignupScreen.jsx / OTPScreen.jsx
│   ├── RoutineScreen.jsx / AgeGroupScreen.jsx
│   ├── Quiz1Screen.jsx / Quiz2Screen.jsx / Quiz3Screen.jsx
│   ├── AnalyzingScreen.jsx / FinalLoadingScreen.jsx
│   ├── ResultScreen.jsx          ← Body type diagnosis + timer + transformation timeline
│   ├── RootCauseScreen.jsx
│   ├── PlanScreen.jsx            ← Basic ₹1,999 / Advanced ₹3,999 / Premium ₹9,999
│   ├── ProductScreen.jsx         ← Auto-recommended stack + live ticker
│   ├── SocialProofScreen.jsx     ← Testimonials + Why VI Works (NEW)
│   ├── CheckoutScreen.jsx
│   ├── PaymentScreens.jsx        ← Upgraded success + Day 1 guide
│   ├── DashboardScreen.jsx       ← 5 tabs: Plan, Videos, Care, Progress, Library
│   └── ProfileScreen.jsx
├── components/UI.jsx             ← White-themed component library
└── constants/colors.js           ← White + dark gold premium palette
```

## Backend (FastAPI + Firebase)

```
backend/
├── main.py                       ← FastAPI app with CORS + logging
├── middleware/
│   └── auth.py                   ← Firebase ID token verification (all protected routes)
├── routes/
│   ├── orders.py                 ← Order creation (auth required)
│   ├── payments.py               ← Razorpay verify + subscription + WhatsApp queue
│   └── coupons.py
└── seed_firestore.py             ← Run once to seed all collections
```

## Firestore Collections

| Collection      | Purpose |
|----------------|---------|
| `users`         | One doc per user (auth + plan status) |
| `quizResults`   | Quiz answers + scores + bodyTypeId (progressive persistence) |
| `products`      | Product catalogue |
| `plans`         | Plan definitions + pricing |
| `orders`        | Order records |
| `subscriptions` | Active plan subscriptions |
| `consultations` | Expert booking records |
| `whatsappQueue` | Day 3 / Day 7 / Day 15 retention messages |
| `quizMappings`  | Body type → product stack (Firestore-extensible) |
| `coupons`       | Discount coupon codes |
| `_schemas`      | Collection structure reference docs |

## Body Types (Recommendation Engine)

| Body Type | Trigger | Products | Plan |
|-----------|---------|----------|------|
| High Stress / Low Vitality | Mental + lifestyle both low | Adaptogenic stack | Advanced |
| Hormonal Decline | Low libido + physical score | Testosterone stack | Advanced |
| Performance Deficit | Erection/timing issues | Vascular + stamina stack | Advanced |
| Age-Related Drop | Age 36+ | Rasayana + age stack | Premium |
| Optimisation Mode | Scores > 65 | Precision stack | Basic |

## User Flow

```
/ → /signup → /otp → /routine → /age-group → /quiz-1 → /analyzing
→ /quiz-2 → /quiz-3 → /final-loading → /result → /root-cause
→ /plan → /product → /social-proof → /checkout → /success → /dashboard
```

## Setup

### Frontend
```bash
cd frontend
cp .env.example .env          # fill Firebase config
npm install
npm run dev
```

### Backend
```bash
cd backend
cp .env.example .env          # fill Firebase + Razorpay keys
pip install -r requirements.txt
python seed_firestore.py      # seed Firestore once
uvicorn main:app --reload
```

### Auth Note
- All `/api/orders/*` and `/api/payments/*` routes require Firebase Bearer token
- Set `SKIP_AUTH=true` in `.env` for local development only
- Never set `SKIP_AUTH=true` in production

## WhatsApp Retention (Day 3 / Day 7 / Day 15)

After successful payment, records are added to `whatsappQueue` collection with scheduled send times.
Set up a Firebase Cloud Function or cron job to read this collection and send messages via WhatsApp Business API.

## Plans

| Plan     | Price      | Duration   | Key Features |
|---------|-----------|-----------|-------------|
| Basic   | ₹1,999    | 1 month   | Product kit + 1 expert consult + WhatsApp |
| Advanced | ₹3,999   | 1 month   | All Basic + 4 experts/week + body checkup + diet |
| Premium | ₹9,999    | 3 months  | All Advanced + weekly personal coach + custom formulas |
