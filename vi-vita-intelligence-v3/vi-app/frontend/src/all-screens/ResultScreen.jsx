import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, ScreenWrapper } from '../components/UI'
import { C, G } from '../constants/colors'
import { detectBodyType, BODY_TYPES } from '../utils/recommendationEngine'

// ── 12-min batch reservation timer ───────────────────────
function ReservationTimer() {
  const [secs, setSecs] = useState(12 * 60)
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s > 0 ? s - 1 : 12 * 60), 1000)
    return () => clearInterval(t)
  }, [])
  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.red, animation: 'pulse-gold 1.5s infinite' }} />
      <span style={{ color: C.red, fontSize: 13, fontWeight: 700 }}>Batch reserved: {mm}:{ss}</span>
    </div>
  )
}

// ── Transformation timeline ───────────────────────────────
const TIMELINE = [
  { day: 'Day 1',  icon: '🌱', label: 'Ojas Rebuilding',    desc: 'Nutrients start absorbing. Gut microbiome primed.' },
  { day: 'Day 7',  icon: '⚡', label: 'Energy Rising',       desc: 'Noticeable boost in daily energy and morning vitality.' },
  { day: 'Day 15', icon: '💪', label: 'First Real Changes',  desc: 'Performance improvements begin. Confidence increases.' },
  { day: 'Day 30', icon: '🔥', label: 'Strong Momentum',     desc: 'Significant transformation in vitality and drive.' },
  { day: 'Day 90', icon: '👑', label: 'Complete Protocol',   desc: 'Lasting hormonal change. Peak vitality achieved.' },
]

export default function ResultScreen() {
  const navigate = useNavigate()
  const { state, update } = useApp()
  const { userName, vitaScore, lifestyleScore, physicalScore, mentalScore, performanceScore } = state
  const [revealTimeline, setRevealTimeline] = useState(false)
  const [visibleStep, setVisibleStep] = useState(0)

  // Detect body type
  const bodyType = detectBodyType(state)

  // Save body type to context
  useEffect(() => {
    if (bodyType?.id) update({ bodyTypeId: bodyType.id, recommendedPlan: bodyType.plan })
  }, [])

  // Reveal timeline step by step after 1s delay
  useEffect(() => {
    if (!revealTimeline) return
    const t = setInterval(() => {
      setVisibleStep(v => {
        if (v >= TIMELINE.length - 1) { clearInterval(t); return v }
        return v + 1
      })
    }, 280)
    return () => clearInterval(t)
  }, [revealTimeline])

  const scoreColor = vitaScore < 50 ? C.red : vitaScore < 70 ? C.orange : C.green
  const scoreLabel = vitaScore < 50 ? 'Needs Urgent Attention' : vitaScore < 70 ? 'Moderate — Room to Grow' : 'Good Foundation'

  return (
    <ScreenWrapper bg={C.bgMid}>
      {/* ── Reservation banner ── */}
      <div style={{ background: G.hero, padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'rgba(255,215,0,0.85)', fontSize: 12, fontWeight: 600 }}>🔒 Custom plan generated for you</div>
        <ReservationTimer />
      </div>

      <div style={{ padding: '20px 20px 120px' }}>
        {/* ── Greeting ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ color: C.muted, fontSize: 13 }}>Hi {userName || 'there'} 👋  Your VI Report</div>
            <div style={{ color: C.text, fontSize: 22, fontWeight: 800 }}>VitaScore Complete</div>
          </div>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onGold, fontSize: 20, fontWeight: 700 }}>
            {(userName || 'U')[0]}
          </div>
        </div>

        {/* ── VitaScore card ── */}
        <div style={{ background: G.hero, borderRadius: 22, padding: 22, marginBottom: 16, boxShadow: '0 6px 24px rgba(26,14,0,0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginBottom: 6 }}>VITA INTELLIGENCE SCORE</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                <span style={{ color: '#FFD700', fontSize: 64, fontWeight: 900, lineHeight: 1 }}>{vitaScore}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20, marginBottom: 8 }}>/100</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '3px 12px', display: 'inline-block', color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 6 }}>
                {scoreLabel}
              </div>
            </div>
            {/* Score ring */}
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <svg width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={40} cy={40} r={32} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={8} />
                <circle cx={40} cy={40} r={32} fill="none" stroke="#FFD700" strokeWidth={8}
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - vitaScore / 100)}
                  strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#FFD700', fontSize: 14, fontWeight: 800 }}>{vitaScore}%</span>
              </div>
            </div>
          </div>
          {/* Score bar */}
          <div style={{ height: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 3, marginBottom: 6 }}>
            <div style={{ height: '100%', width: `${vitaScore}%`, background: G.gold, borderRadius: 3, transition: 'width 1s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {['0 — Critical', 'Moderate', '100 — Peak'].map(t => (
              <span key={t} style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── Body Type Diagnosis ── */}
        <div style={{ background: bodyType.bgColor, border: `2px solid ${bodyType.borderColor}`, borderRadius: 20, padding: 20, marginBottom: 16, borderLeft: `5px solid ${bodyType.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff', border: `1.5px solid ${bodyType.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: `0 2px 10px ${bodyType.color}25` }}>
                {bodyType.icon}
              </div>
              <div>
                <div style={{ color: bodyType.color, fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>YOUR BODY TYPE</div>
                <div style={{ color: C.text, fontSize: 17, fontWeight: 800 }}>{bodyType.label}</div>
              </div>
            </div>
            <div style={{ background: bodyType.color, borderRadius: 20, padding: '4px 12px', color: '#fff', fontSize: 11, fontWeight: 700 }}>
              {bodyType.urgency === 'CRITICAL' ? '🔴 Critical' : bodyType.urgency === 'HIGH' ? '🟠 High' : '🟢 Moderate'}
            </div>
          </div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.65, marginBottom: 14 }}>{bodyType.description}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {bodyType.coreIssues.map(i => (
              <div key={i} style={{ background: '#fff', border: `1px solid ${bodyType.borderColor}`, borderRadius: 20, padding: '3px 10px', color: bodyType.color, fontSize: 11, fontWeight: 600 }}>{i}</div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${bodyType.borderColor}`, paddingTop: 12 }}>
            <div style={{ color: bodyType.color, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>✅ VI Solution Includes:</div>
            {bodyType.solutions.map(s => (
              <div key={s} style={{ color: C.muted, fontSize: 12, marginBottom: 3 }}>→ {s}</div>
            ))}
          </div>
        </div>

        {/* ── Score Breakdown ── */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Score Breakdown</div>
          <div style={{ color: C.gold, fontSize: 11, fontStyle: 'italic', marginBottom: 16 }}>VI Intelligence Diagnostic Report</div>
          {[
            { icon: '⏰', l: 'Lifestyle',   s: lifestyleScore,   max: 25 },
            { icon: '💪', l: 'Physical',    s: physicalScore,    max: 25 },
            { icon: '🧠', l: 'Mental',      s: mentalScore,      max: 25 },
            { icon: '⚡', l: 'Performance', s: performanceScore, max: 25 },
          ].map(item => {
            const pct = (item.s / item.max) * 100
            const barColor = pct < 40 ? C.red : pct < 65 ? C.orange : C.green
            return (
              <div key={item.l} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span>{item.icon}</span>
                    <span style={{ color: C.text, fontSize: 14 }}>{item.l}</span>
                  </div>
                  <span style={{ color: barColor, fontWeight: 700, fontSize: 14 }}>
                    {item.s}<span style={{ color: C.muted, fontWeight: 400 }}>/{item.max}</span>
                  </span>
                </div>
                <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 3, transition: 'width 1s ease' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Before vs After Promise ── */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Where You Are vs Where You'll Be</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, padding: 14 }}>
              <div style={{ color: C.red, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>❌ Right Now</div>
              {['Low energy daily', 'Performance anxiety', 'Confidence drop', 'Sleep issues'].map(t => (
                <div key={t} style={{ color: C.muted, fontSize: 12, marginBottom: 5 }}>• {t}</div>
              ))}
            </div>
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 14, padding: 14 }}>
              <div style={{ color: C.green, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>✅ After VI Protocol</div>
              {['Peak daily energy', 'Confident performance', 'Strong drive daily', 'Deep recovery sleep'].map(t => (
                <div key={t} style={{ color: C.text, fontSize: 12, marginBottom: 5, fontWeight: 500 }}>• {t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Transformation Timeline ── */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>Your Transformation Timeline</div>
            {!revealTimeline && (
              <div onClick={() => { setRevealTimeline(true); setVisibleStep(0) }} style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 20, padding: '4px 12px', color: C.gold, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                Reveal →
              </div>
            )}
          </div>
          {!revealTimeline ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🗓️</div>
              <div style={{ color: C.muted, fontSize: 13 }}>Tap "Reveal" to see your Day 1 → Day 90 roadmap</div>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: 19, top: 20, bottom: 0, width: 2, background: C.border }} />
              {TIMELINE.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16, opacity: i <= visibleStep ? 1 : 0.2, transition: 'opacity .4s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: i <= visibleStep ? G.gold : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, zIndex: 1, boxShadow: i <= visibleStep ? '0 2px 8px rgba(185,129,26,0.3)' : 'none', transition: 'all .4s' }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                      <div style={{ background: i <= visibleStep ? C.goldBg : C.bgMid, border: `1px solid ${i <= visibleStep ? C.goldBorder : C.border}`, borderRadius: 20, padding: '1px 8px', color: i <= visibleStep ? C.gold : C.subtle, fontSize: 10, fontWeight: 700 }}>{item.day}</div>
                      <div style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{item.label}</div>
                    </div>
                    <div style={{ color: C.muted, fontSize: 12 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Social proof ── */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Join <span style={{ color: C.gold }}>10,000+ Men</span> Who Reversed This</div>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>Same body type. Same issues. Transformed.</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            {'ABCDE'.split('').map((l, i) => (
              <div key={i} style={{ width: 34, height: 34, borderRadius: '50%', background: G.gold, border: `2px solid #fff`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onGold, fontSize: 12, fontWeight: 700, marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }}>{l}</div>
            ))}
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.goldBg, border: `2px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontSize: 9, fontWeight: 700, marginLeft: -8 }}>+10K</div>
          </div>
          {/* Testimonial */}
          <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 14, padding: 14 }}>
            <div style={{ color: C.gold, fontSize: 13, marginBottom: 8 }}>⭐⭐⭐⭐⭐</div>
            <div style={{ color: C.text, fontSize: 13, fontStyle: 'italic', marginBottom: 10, lineHeight: 1.6 }}>
              "I was exactly in the same category — {bodyType.shortDesc}. After 3 months on VI, I scored 84. The change was real and lasting."
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onGold, fontWeight: 700 }}>R</div>
              <div>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>Rahul M.</div>
                <div style={{ color: C.muted, fontSize: 11 }}>Mumbai · Age 36 · VitaScore 54→84</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Plan recommendation ── */}
        <div style={{ background: G.hero, borderRadius: 20, padding: 20, marginBottom: 24, boxShadow: '0 4px 20px rgba(26,14,0,0.2)' }}>
          <div style={{ color: 'rgba(255,215,0,0.8)', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>🎯 AI RECOMMENDATION FOR YOU</div>
          <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{bodyType.planLabel}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 14 }}>Based on your {bodyType.label} diagnosis and VitaScore {vitaScore}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {['Personalised stack', `${bodyType.productIds.length} targeted formulas`, 'Expert support', '3-month protocol'].map(t => (
              <div key={t} style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 20, padding: '3px 10px', color: '#FFD700', fontSize: 11, fontWeight: 600 }}>{t}</div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 14px', marginBottom: 14 }}>
            <div style={{ color: 'rgba(255,215,0,0.9)', fontSize: 12, fontWeight: 600 }}>⏱️ Use regularly for 15 days → see first changes. 3 months for complete transformation.</div>
          </div>
        </div>

        <GoldBtn onClick={() => navigate('/root-cause')} height={58} style={{ marginBottom: 12, fontSize: 16 }}>
          See What's Causing This →
        </GoldBtn>
        <div onClick={() => navigate('/plan')} style={{ textAlign: 'center', color: C.muted, fontSize: 14, cursor: 'pointer', padding: 10 }}>
          Skip to My Plan →
        </div>
      </div>
    </ScreenWrapper>
  )
}
