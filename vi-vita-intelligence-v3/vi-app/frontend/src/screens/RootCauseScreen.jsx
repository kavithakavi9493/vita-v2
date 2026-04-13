import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, ScreenWrapper, BottomBar } from '../components/UI'
import { C, G } from '../constants/colors'

const CAUSE_CARDS = {
  stress: {
    color: C.red, bg: '#1A0000', icon: '🧠',
    title: 'Chronic Stress', badge: 'High Impact',
    sub: 'Mental & hormonal disruption',
    metrics: ['↑68% Cortisol', '↓40% Testosterone', '↓35% Energy'],
    desc: 'Prolonged stress elevates cortisol which directly suppresses testosterone production creating a cycle of fatigue and poor performance.',
    syms: ['Difficulty switching off mentally', 'Low motivation and drive', 'Reduced interest in intimacy'],
    product: '→ Manas Veerya targets your cortisol response directly',
  },
  routine: {
    color: C.orange, bg: '#1A0A00', icon: '🌙',
    title: 'Disrupted Routine', badge: 'Moderate Impact',
    sub: 'Sleep & recovery deficit',
    metrics: ['↓45% Recovery', '↑50% Inflammation', '↓30% Hormone Sync'],
    desc: 'Irregular sleep disrupts your body\'s hormonal rhythm. Testosterone is primarily produced during deep sleep cycles.',
    syms: ['Waking up tired despite sleeping', 'Poor digestion and bloating', 'Mood swings and irritability'],
    product: '→ Rasayana Shakti rebuilds your sleep cycle',
  },
  performance: {
    color: C.gold, bg: C.goldBg, icon: '⚡',
    title: 'Performance Decline', badge: 'Direct Impact',
    sub: 'Vascular & hormonal weakness',
    metrics: ['↓55% Blood Flow', '↓48% Stamina', '↓60% Confidence'],
    desc: 'Reduced nitric oxide and low testosterone affect vascular function. This is highly treatable with the right natural formulation.',
    syms: ['Difficulty maintaining performance', 'Reduced stamina and endurance', 'Loss of confidence over time'],
    product: '→ Vajra Veerya + Sthambhan Shakti dual formula',
  },
  age: {
    color: C.purple, bg: C.purpleBg, icon: '🕐',
    title: 'Age-Accelerated Decline', badge: 'Age Related',
    sub: 'Natural testosterone reduction',
    metrics: ['↓3%/yr Testosterone', '↓Recovery Speed', '↑Stress Impact'],
    desc: 'After 35, testosterone drops 3-5% every year. Without targeted support this compounds all other issues.',
    syms: ['Lower stamina than before', 'Slower recovery after exertion', 'Reduced overall vitality'],
    product: '→ Yuva Vajra formulated specifically for men above 35',
  },
}

export default function RootCauseScreen() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { vitaScore, lifestyleScore, physicalScore, mentalScore, performanceScore, ageGroup } = state

  const causes = []
  if (mentalScore     < 15) causes.push('stress')
  if (lifestyleScore  < 15) causes.push('routine')
  if (performanceScore< 15) causes.push('performance')
  if (ageGroup === '36-45' || ageGroup === '45+') causes.push('age')

  return (
    <ScreenWrapper>
      {/* Header */}
      <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>Root Cause Analysis</div>
          <div style={{ color: C.muted, fontSize: 13 }}>What's affecting your vitality</div>
        </div>
        <div style={{ background: C.goldBg, border: `1px solid ${C.gold}`, borderRadius: 20, padding: '4px 12px', color: C.gold, fontSize: 11, fontWeight: 600 }}>
          🔬 VI Diagnosed
        </div>
      </div>

      <div style={{ padding: '16px 24px 120px' }}>
        {/* Mini score bar */}
        <div style={{ background: C.card, borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: C.text, fontSize: 13 }}>VitaScore: <span style={{ color: C.gold, fontWeight: 700 }}>{vitaScore}/100</span></div>
          <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${vitaScore}%`, background: G.gold, borderRadius: 2 }} />
          </div>
        </div>

        {/* Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>Root Causes Identified</div>
          <div style={{ background: '#2A0000', border: `1px solid ${C.red}`, borderRadius: 20, padding: '3px 12px', color: C.red, fontSize: 12, fontWeight: 700 }}>
            {causes.length} Found
          </div>
        </div>

        {/* All good state */}
        {causes.length === 0 && (
          <div style={{ background: C.card, border: `2px solid ${C.gold}`, borderRadius: 20, padding: 24, marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>You're in Good Shape!</div>
            <div style={{ background: C.goldBg, border: `1px solid ${C.gold}`, borderRadius: 20, padding: '3px 14px', color: C.gold, fontSize: 12, display: 'inline-block', marginBottom: 8 }}>Maintenance</div>
            <div style={{ color: C.muted, fontSize: 13 }}>No critical issues found. A VI maintenance plan will keep you at peak performance.</div>
          </div>
        )}

        {/* Cause cards */}
        {causes.map(key => {
          const c = CAUSE_CARDS[key]
          return (
            <div key={key} style={{ background: c.bg, border: `1px solid ${c.color}40`, borderRadius: 20, padding: 20, marginBottom: 16, borderLeft: `4px solid ${c.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${c.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{c.icon}</div>
                  <div>
                    <div style={{ color: c.color, fontSize: 15, fontWeight: 700 }}>{c.title}</div>
                    <div style={{ color: C.muted, fontSize: 12 }}>{c.sub}</div>
                  </div>
                </div>
                <div style={{ background: `${c.color}20`, border: `1px solid ${c.color}`, borderRadius: 20, padding: '3px 10px', color: c.color, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{c.badge}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
                {c.metrics.map(m => (
                  <div key={m} style={{ background: C.bgDeep, borderRadius: 8, padding: '6px 8px', color: c.color, fontSize: 10, fontWeight: 600, textAlign: 'center' }}>{m}</div>
                ))}
              </div>
              <div style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>{c.desc}</div>
              <div style={{ background: C.bgDeep, borderRadius: 10, padding: 12, marginBottom: 12 }}>
                {c.syms.map(s => <div key={s} style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>• {s}</div>)}
              </div>
              <div style={{ color: C.gold, fontSize: 13, fontWeight: 500 }}>{c.product}</div>
            </div>
          )
        })}

        {/* Warning */}
        <div style={{ background: C.bgDeep, border: `1px solid ${C.red}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ color: C.red, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>⚠️ If Left Untreated</div>
          {['Conditions worsen progressively', 'Cycle becomes harder to break', 'Testosterone drops 3-5% every year'].map(p => (
            <div key={p} style={{ color: C.muted, fontSize: 13, marginBottom: 4 }}>→ {p}</div>
          ))}
        </div>

        {/* Solution */}
        <div style={{ background: C.goldBg, border: `1px solid ${C.gold}`, borderRadius: 20, padding: 20, marginBottom: 24, boxShadow: '0 0 20px rgba(255,215,0,0.1)' }}>
          <div style={{ color: C.gold, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>✨ The VI Solution</div>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>
            Based on your root causes VI has built a personalised plan with proven Ayurvedic formulations targeting your exact needs.
          </div>
          {['Targets all identified root causes', 'Results visible from Week 1', '100% natural — no side effects'].map(p => (
            <div key={p} style={{ color: C.text, fontSize: 13, marginBottom: 6 }}>✅ {p}</div>
          ))}
          <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
            {['94% Success', '10,000+ Helped', '+38pts Avg'].map(s => (
              <div key={s} style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>{s}</div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', color: C.muted, fontSize: 12 }}>
          🔒 Clinically Tested &nbsp;·&nbsp; 🚚 Free Delivery &nbsp;·&nbsp; ↩ 3-Month Protocol
        </div>
      </div>

      <BottomBar>
        <GoldBtn onClick={() => navigate('/plan')} height={60} style={{ fontSize: 16 }}>
          See My Personalised Plan →
        </GoldBtn>
      </BottomBar>
    </ScreenWrapper>
  )
}
