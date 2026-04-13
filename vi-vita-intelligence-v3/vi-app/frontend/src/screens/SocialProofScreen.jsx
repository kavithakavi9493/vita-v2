import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, BottomBar } from '../components/UI'
import { C, G } from '../constants/colors'

// ── Live Social Proof Ticker ──────────────────────────────
const TICKER_MSGS = [
  '🔥 Arjun from Bangalore just ordered Advanced Plan',
  '⭐ Vikram from Delhi started his VI journey',
  '💪 Rohit from Mumbai upgraded to Premium Plan',
  '🎉 Suresh from Hyderabad completed Week 4',
  '🔥 Manish from Pune just ordered Basic Plan',
  '💊 Karan from Chennai started taking Vajra Veerya',
  '⚡ Deepak from Kolkata saw results in 15 days',
  '🏆 Anil from Jaipur upgraded from Basic to Advanced',
]

function LiveTicker() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % TICKER_MSGS.length)
        setVisible(true)
      }, 300)
    }, 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ background: '#F0FDF4', border: `1px solid #BBF7D0`, borderRadius: 10, padding: '8px 14px', display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, flexShrink: 0 }} />
      <div style={{ color: C.green, fontSize: 12, fontWeight: 600, transition: 'opacity 0.3s', opacity: visible ? 1 : 0 }}>
        {TICKER_MSGS[idx]}
      </div>
    </div>
  )
}

// ── Data ─────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Rahul M.', age: 38, city: 'Mumbai', plan: 'Advanced',
    before: 54, after: 84, weeks: 6,
    quote: 'My wife noticed the change before I told her I was on VI. Energy, confidence, performance — everything shifted.',
    bodyType: 'High Stress / Low Vitality',
  },
  {
    name: 'Arjun S.', age: 34, city: 'Bangalore', plan: 'Basic',
    before: 47, after: 79, weeks: 8,
    quote: 'I was sceptical. Ancient formulas? But by Day 15 I felt something real. By month 2 I was a different person.',
    bodyType: 'Performance Deficit',
  },
  {
    name: 'Vikram P.', age: 42, city: 'Delhi', plan: 'Premium',
    before: 52, after: 91, weeks: 12,
    quote: '3 months on Premium changed my marriage. My wife says I\'m 10 years younger. The weekly expert calls made a huge difference.',
    bodyType: 'Age-Related Decline',
  },
  {
    name: 'Kiran D.', age: 36, city: 'Hyderabad', plan: 'Advanced',
    before: 61, after: 88, weeks: 10,
    quote: 'The expert consultation in Week 1 alone was worth the entire plan. They knew exactly what I needed.',
    bodyType: 'Hormonal Decline',
  },
  {
    name: 'Suresh K.', age: 40, city: 'Chennai', plan: 'Advanced',
    before: 49, after: 83, weeks: 8,
    quote: 'From 49 to 83 in 2 months. The Vajra Veerya + Rasayana Shakti combo is unreal.',
    bodyType: 'Hormonal Decline',
  },
  {
    name: 'Deepak R.', age: 33, city: 'Pune', plan: 'Basic',
    before: 58, after: 76, weeks: 5,
    quote: 'Day 15 energy improvement was real. I\'m sleeping better, performing better, and feeling 5 years younger.',
    bodyType: 'High Stress / Low Vitality',
  },
]

const TRUST_BADGES = [
  { icon: '🏔️', label: 'Himalayan\nSourced' },
  { icon: '🔬', label: 'Lab\nTested' },
  { icon: '✅', label: 'FSSAI\nCertified' },
  { icon: '🌿', label: '100%\nNatural' },
  { icon: '⚗️', label: 'Ancient\nFormulas' },
]

const WHY_VI = [
  { icon: '🏔️', title: 'Himalayan Sourcing', desc: 'Raw ingredients sourced directly from altitudes above 3,000m — where potency is highest' },
  { icon: '📜', title: 'Ancient Siddha Science', desc: 'Formulas from 500+ year-old Sanskrit texts, validated by Chetan Patil\'s 8 years in the Himalayas' },
  { icon: '🔬', title: 'Modern Validation', desc: 'Every formula backed by bioavailability testing and clinical research with measurable outcomes' },
  { icon: '🧬', title: 'No Shortcuts. Ever.', desc: 'Zero steroids, zero synthetics, zero proprietary blends. Full ingredient transparency on every product' },
]

export default function SocialProofScreen() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { planType, selectedAmount, bodyTypeId } = state

  return (
    <div style={{ width: '100%', height: '100%', background: C.bgMid, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* ── Header ── */}
        <div style={{ background: G.hero, padding: '24px 20px 20px' }}>
          <div style={{ color: 'rgba(255,215,0,0.8)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>REAL MEN · REAL RESULTS</div>
          <div style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>10,000+ Transformations</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Men who were exactly where you are — and changed everything.</div>
        </div>

        <div style={{ padding: '16px 16px 20px' }}>

          {/* ── Live Ticker ── */}
          <LiveTicker />

          {/* ── Stats bar ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
            {[{ v: '10,000+', l: 'Men Helped', i: '👨' }, { v: '94%', l: 'Success Rate', i: '🎯' }, { v: '4.9★', l: 'Average Rating', i: '⭐' }].map(s => (
              <div key={s.l} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 10px', textAlign: 'center', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.i}</div>
                <div style={{ color: C.gold, fontSize: 16, fontWeight: 800 }}>{s.v}</div>
                <div style={{ color: C.muted, fontSize: 10 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* ── Featured testimonial ── */}
          <div style={{ background: G.hero, borderRadius: 20, padding: 22, marginBottom: 16, boxShadow: '0 4px 20px rgba(26,14,0,0.2)' }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
              {'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i} style={{ fontSize: 16 }}>{s}</span>)}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontStyle: 'italic', lineHeight: 1.7, marginBottom: 16 }}>
              "{TESTIMONIALS[0].quote}"
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onGold, fontWeight: 800, fontSize: 18 }}>{TESTIMONIALS[0].name[0]}</div>
                <div>
                  <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 700 }}>{TESTIMONIALS[0].name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{TESTIMONIALS[0].city} · Age {TESTIMONIALS[0].age} · {TESTIMONIALS[0].plan}</div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: 12, padding: '6px 12px', textAlign: 'center' }}>
                <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 800 }}>{TESTIMONIALS[0].before}→{TESTIMONIALS[0].after}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>VitaScore</div>
              </div>
            </div>
          </div>

          {/* ── Testimonial grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {TESTIMONIALS.slice(1).map((t, i) => (
              <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onGold, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ color: C.muted, fontSize: 10 }}>{t.city} · {t.plan}</div>
                  </div>
                </div>
                <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 8, padding: '4px 8px', display: 'inline-flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ color: C.gold, fontSize: 11, fontWeight: 800 }}>{t.before}</span>
                  <span style={{ color: C.gold, fontSize: 11 }}>→</span>
                  <span style={{ color: C.gold, fontSize: 11, fontWeight: 800 }}>{t.after}</span>
                  <span style={{ color: C.muted, fontSize: 9 }}>score</span>
                </div>
                <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.5, fontStyle: 'italic' }}>"{t.quote.slice(0, 80)}..."</div>
                <div style={{ color: C.gold, fontSize: 11, marginTop: 6 }}>{'⭐'.repeat(5)}</div>
              </div>
            ))}
          </div>

          {/* ── Why VI works ── */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Why VI Actually Works</div>
            {WHY_VI.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < WHY_VI.length - 1 ? 14 : 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: C.goldBg, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{item.title}</div>
                  <div style={{ color: C.muted, fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Trust badges ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 10px', marginBottom: 18, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
            {TRUST_BADGES.map(b => (
              <div key={b.label} style={{ textAlign: 'center' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: C.goldBg, border: `1.5px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontSize: 18 }}>{b.icon}</div>
                <div style={{ color: C.muted, fontSize: 8, whiteSpace: 'pre-line', fontWeight: 600 }}>{b.label}</div>
              </div>
            ))}
          </div>

          {/* ── Himalayan authenticity ── */}
          <div style={{ background: G.hero, borderRadius: 18, padding: 18, marginBottom: 20, boxShadow: '0 4px 16px rgba(26,14,0,0.2)' }}>
            <div style={{ color: '#FFD700', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>🏔️ 100% Authentic Himalayan Sourcing</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
              Every raw ingredient is personally verified by our sourcing team at altitudes above 3,000m in the Himalayas. No middlemen. No substitutes. No compromise.
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Shilajit from 4,200m', 'Ashwagandha — Nagori Grade', 'Safed Musli — Premium', 'Saffron — Kashmiri A-Grade'].map(t => (
                <div key={t} style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 20, padding: '3px 10px', color: '#FFD700', fontSize: 10, fontWeight: 600 }}>{t}</div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Sticky CTA ── */}
      <BottomBar>
        <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 10, padding: '8px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: C.muted, fontSize: 11 }}>10,000+ men already transformed</div>
          <div style={{ color: C.green, fontSize: 11, fontWeight: 600 }}>94% success rate</div>
        </div>
        <GoldBtn onClick={() => navigate('/checkout')} height={56}>
          I'm Ready — Proceed to Checkout →
        </GoldBtn>
        <div style={{ textAlign: 'center', color: C.muted, fontSize: 11, marginTop: 8 }}>🔒 Secure payment · Free delivery · ₹{(selectedAmount || 1999).toLocaleString()}</div>
      </BottomBar>
    </div>
  )
}
