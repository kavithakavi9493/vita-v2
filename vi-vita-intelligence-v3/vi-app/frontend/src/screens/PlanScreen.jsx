import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, ScreenWrapper } from '../components/UI'
import { C, G } from '../constants/colors'

const FAQS = [
  { q: 'When will I see results?', a: 'With regular use, most men notice energy and mood improvements within 15 days. For complete sexual wellness transformation, we highly recommend the full 3-month protocol.' },
  { q: 'Are the products safe?', a: '100% natural Ayurvedic formulations based on ancient Siddha science. No steroids, no chemicals. Clinically tested, FSSAI certified, lab verified.' },
  { q: 'Can I change my plan later?', a: 'Yes. You can upgrade your plan at any time from your dashboard. Upgrades are prorated.' },
  { q: 'What experts can I consult?', a: 'Choose from Sexual Health Expert, Nutritionist, Ayurvedic Specialist, or Wellness Coach — based on your needs.' },
]

const COMPARE_ROWS = [
  { f: 'Product Recommendation',   b: true,  a: true,  p: true  },
  { f: 'Progress Tracking',        b: true,  a: true,  p: true  },
  { f: 'Weekly Session Invite',    b: true,  a: true,  p: true  },
  { f: 'WhatsApp Support',         b: true,  a: true,  p: true  },
  { f: '1 Expert Consultation',    b: true,  a: true,  p: true  },
  { f: 'Monthly Body Checkup',     b: false, a: true,  p: true  },
  { f: '4 Experts/Week',          b: false, a: true,  p: true  },
  { f: 'Free Diet Plans',          b: false, a: true,  p: true  },
  { f: 'Weekly Personal Coach',    b: false, a: false, p: true  },
  { f: 'Advanced Custom Formulas', b: false, a: false, p: true  },
]

export default function PlanScreen() {
  const navigate = useNavigate()
  const { state, update } = useApp()
  const { vitaScore, userName } = state
  const [countdown, setCountdown] = useState(23 * 60 + 47)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const mm = String(Math.floor(countdown / 60)).padStart(2, '0')
  const ss = String(countdown % 60).padStart(2, '0')

  const handleSelect = (planType, amount) => {
    update({ planType, selectedAmount: amount })
    navigate('/product')
  }

  const PlanCard = ({ type, title, duration, price, original, tag, features, notIncluded, cta, highlight, onSelect }) => (
    <div style={{ background: highlight ? C.goldBg : C.white, border: `${highlight ? 2 : 1}px solid ${highlight ? C.goldDeep : C.border}`, borderRadius: 22, padding: 22, marginBottom: 14, boxShadow: highlight ? '0 4px 24px rgba(185,129,26,0.18)' : '0 2px 12px rgba(0,0,0,0.06)', position: 'relative' }}>
      {tag && (
        <div style={{ position: 'absolute', top: -1, right: 20, background: G.gold, color: C.onGold, fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: '0 0 12px 12px' }}>
          {tag}
        </div>
      )}
      <div style={{ color: C.text, fontSize: 20, fontWeight: 800 }}>{title}</div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>{duration}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 4 }}>
        <span style={{ color: C.muted, fontSize: 14, textDecoration: 'line-through' }}>₹{original.toLocaleString()}</span>
        <span style={{ color: highlight ? C.gold : C.text, fontSize: 28, fontWeight: 800 }}>₹{price.toLocaleString()}</span>
      </div>
      <div style={{ color: C.green, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
        Save ₹{(original - price).toLocaleString()} · {Math.round(((original - price) / original) * 100)}% OFF
      </div>

      {features.map(f => (
        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
          <span style={{ color: C.green, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✅</span>
          <span style={{ color: C.text, fontSize: 13 }}>{f}</span>
        </div>
      ))}
      {(notIncluded || []).map(f => (
        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
          <span style={{ color: C.border, fontSize: 14, flexShrink: 0, marginTop: 1 }}>—</span>
          <span style={{ color: C.subtle, fontSize: 13, textDecoration: 'line-through' }}>{f}</span>
        </div>
      ))}
      <div style={{ marginTop: 18 }}>
        {highlight ? (
          <GoldBtn onClick={onSelect}>{cta}</GoldBtn>
        ) : (
          <GoldBtn outline onClick={onSelect}>{cta}</GoldBtn>
        )}
      </div>
    </div>
  )

  return (
    <ScreenWrapper bg={C.bgMid}>
      {/* Urgency banner */}
      <div style={{ background: G.gold, padding: '10px 24px', textAlign: 'center', color: C.onGold, fontWeight: 700, fontSize: 13 }}>
        🔥 Limited Time Offer — Ends Tonight
      </div>

      <div style={{ padding: '24px 20px 120px' }}>
        {/* Heading */}
        <div style={{ marginBottom: 6 }}>
          <span style={{ color: C.text, fontSize: 26, fontWeight: 800 }}>Choose Your </span>
          <span style={{ color: C.gold, fontSize: 26, fontWeight: 800 }}>VI Plan</span>
        </div>
        <div style={{ color: C.muted, fontSize: 14, marginBottom: 18 }}>Personalised for your VitaScore of {vitaScore}</div>

        {/* Score strip */}
        <div style={{ background: C.white, borderRadius: 14, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onGold, fontWeight: 700 }}>
              {(userName || 'U')[0]}
            </div>
            <div>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{userName || 'User'}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>VitaScore: {vitaScore}/100</div>
            </div>
          </div>
          <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 20, padding: '3px 12px', color: C.gold, fontSize: 11, fontWeight: 600 }}>
            {vitaScore >= 80 ? 'Excellent' : vitaScore >= 60 ? 'Moderate' : 'Needs Help'}
          </div>
        </div>

        {/* Results Promise — replaces guarantee */}
        <div style={{ background: C.navyBg, border: `1px solid ${C.navy}20`, borderRadius: 16, padding: 16, marginBottom: 20, display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 24 }}>⏱️</span>
          <div>
            <div style={{ color: C.navy, fontSize: 15, fontWeight: 700 }}>Our Results Promise</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>
              Use your VI formula <b style={{color:C.text}}>regularly every day</b> — and you'll notice real changes within <b style={{color:C.text}}>15 days</b>. For complete, lasting transformation, a <b style={{color:C.text}}>minimum 3-month protocol</b> is <span style={{color:C.gold, fontWeight:700}}>highly recommended</span>. This is ancient science — it rebuilds from the root.
            </div>
          </div>
        </div>

        {/* ── BASIC PLAN ── */}
        <PlanCard
          title="Basic"
          duration="1 Month Plan"
          price={1999}
          original={2999}
          features={[
            'Complete product recommendation (quiz-based)',
            'Progress tracking dashboard',
            'Weekly group session invitations (free)',
            'One-time expert consultation — your choice:',
            '  ↳ Sexual Health Expert  /  Nutritionist',
            '  ↳ Ayurvedic Specialist  /  Wellness Coach',
            'WhatsApp chat support (9AM–9PM)',
            'Free home delivery',
          ]}
          notIncluded={['Monthly body checkup', '4 experts/week']}
          cta="Start with Basic →"
          onSelect={() => handleSelect('basic', 1999)}
        />

        {/* ── ADVANCED PLAN ── */}
        <PlanCard
          title="Advanced"
          duration="1 Month Plan"
          price={3999}
          original={5999}
          tag="⭐ MOST POPULAR"
          highlight
          features={[
            'All Basic plan features',
            'Free full body checkup every month',
            '4 expert consultations every week',
            '  ↳ Sexual health, nutrition, ayurveda, wellness',
            'Free personalised diet plans',
            'Priority WhatsApp support',
            'Advanced VI dashboard access',
            'Free priority delivery',
          ]}
          cta="Get Advanced Plan →"
          onSelect={() => handleSelect('advanced', 3999)}
        />

        {/* ── PREMIUM PLAN ── */}
        <PlanCard
          title="Premium"
          duration="3 Month Plan · ₹3,333/month"
          price={9999}
          original={14999}
          features={[
            'All Advanced plan features',
            'Monthly full body checkup (every month)',
            'Weekly personal expert — connects to care for you',
            'Advanced formulas developed specifically for you',
            'Dedicated 1:1 health coach',
            'Monthly progress review & plan adjustment',
            'Express priority delivery',
            'Lifetime VI app access',
          ]}
          cta="Get Premium Plan →"
          onSelect={() => handleSelect('premium', 9999)}
        />

        {/* Expert selection note */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 18, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>👨‍⚕️ About Your Expert Consultations</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['🩺 Sexual Health Expert', '🥗 Nutritionist', '🌿 Ayurvedic Specialist', '🧘 Wellness Coach'].map(e => (
              <div key={e} style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 20, padding: '4px 10px', color: C.gold, fontSize: 11, fontWeight: 600 }}>{e}</div>
            ))}
          </div>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>Basic: connect with any one expert once. Advanced/Premium: full team access.</div>
        </div>

        {/* Countdown */}
        <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 6px rgba(185,129,26,0.1)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>🔥</span>
            <span style={{ color: C.orange, fontSize: 13, fontWeight: 600 }}>Offer expires in</span>
          </div>
          <div style={{ color: C.gold, fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{mm}:{ss}</div>
        </div>

        {/* Compare table */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 18, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: G.hero, borderBottom: `1px solid ${C.border}`, padding: '12px 14px' }}>
            {['Feature', 'Basic', 'Adv', 'Prem'].map(h => (
              <div key={h} style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, textAlign: h !== 'Feature' ? 'center' : 'left' }}>{h}</div>
            ))}
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 14px', borderBottom: i < COMPARE_ROWS.length - 1 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? C.white : C.bgMid }}>
              <div style={{ color: C.text, fontSize: 12 }}>{row.f}</div>
              {[row.b, row.a, row.p].map((v, j) => (
                <div key={j} style={{ textAlign: 'center', fontSize: 13 }}>{v ? '✅' : '—'}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 18, background: C.white, borderRadius: 16, padding: '16px 8px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: `1px solid ${C.border}` }}>
          {[{ v: '10,000+', l: 'Men Helped' }, { v: '94%', l: 'Success Rate' }, { v: '4.9★', l: 'Rating' }].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ color: C.gold, fontSize: 18, fontWeight: 800 }}>{s.v}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Common Questions</div>
        {FAQS.map((f, i) => (
          <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 8, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ padding: '13px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{f.q}</span>
              <span style={{ color: C.gold, fontSize: 14 }}>{openFaq === i ? '▲' : '▼'}</span>
            </div>
            {openFaq === i && <div style={{ padding: '0 16px 13px', color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{f.a}</div>}
          </div>
        ))}
      </div>

      {/* Sticky bottom */}
      <div style={{ position: 'sticky', bottom: 0, padding: '14px 20px 20px', background: 'rgba(255,255,255,0.97)', borderTop: `1px solid ${C.border}`, backdropFilter: 'blur(12px)', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <GoldBtn onClick={() => handleSelect('advanced', 3999)} style={{ marginBottom: 8 }}>Get Advanced Plan — ₹3,999/month →</GoldBtn>
        <div style={{ textAlign: 'center', color: C.muted, fontSize: 12 }}>🔒 Secure payment via Razorpay</div>
      </div>
    </ScreenWrapper>
  )
}
