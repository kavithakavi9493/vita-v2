import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ScoreRing } from '../components/UI'
import { C, G } from '../constants/colors'

const MESSAGES = [
  'VI is identifying your root causes...',
  'Building your personal plan...',
  'Selecting your Ayurvedic formulations...',
  'Your intelligence report is ready...',
]

export default function FinalLoadingScreen() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [progress, setProgress] = useState(0)
  const [msgIdx,   setMsgIdx]   = useState(0)

  const { lifestyleScore, physicalScore, mentalScore, performanceScore, vitaScore } = state

  useEffect(() => {
    const mInt = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 1800)
    const pInt = setInterval(() => setProgress(v => Math.min(v + 1, 100)), 55)
    const done = setTimeout(() => navigate('/result', { replace: true }), 5600)
    return () => [mInt, pInt, done].forEach(clearTimeout)
  }, [navigate])

  const lc  = vitaScore < 60 ? C.orange : C.gold
  const lbl = vitaScore >= 80 ? '✨ Excellent' : vitaScore >= 60 ? '📈 Moderate' : '🔥 Needs Improvement'

  return (
    <div style={{
      width: '100%', height: '100%', background: C.bgDeep,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '32px 24px', overflowY: 'auto',
    }}>
      {/* Top badge */}
      <div style={{
        background: C.goldBg, border: `1px solid ${C.gold}`,
        borderRadius: 20, padding: '8px 18px', marginBottom: 24,
      }}>
        <span style={{ color: C.gold, fontSize: 13, fontWeight: 600 }}>✨ VI Analysis Complete</span>
      </div>

      {/* Score ring */}
      <div className="pulse-gold">
        <ScoreRing score={vitaScore} size={200} />
      </div>

      {/* Score label */}
      <div style={{
        background: lc === C.orange ? '#1A0500' : C.goldBg,
        border: `1px solid ${lc}`,
        borderRadius: 20, padding: '5px 18px', marginTop: 16, marginBottom: 24,
      }}>
        <span style={{ color: lc, fontSize: 14, fontWeight: 700 }}>{lbl}</span>
      </div>

      {/* Breakdown row */}
      <div style={{
        background: C.card, borderRadius: 16, padding: 16,
        width: '100%', marginBottom: 24,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {[
            { icon: '☀️', l: 'Lifestyle',   s: lifestyleScore   },
            { icon: '💪', l: 'Physical',    s: physicalScore    },
            { icon: '🧠', l: 'Mental',      s: mentalScore,  c: C.purple },
            { icon: '⚡', l: 'Perform',     s: performanceScore },
          ].map(item => (
            <div key={item.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ color: item.c || C.gold, fontSize: 16, fontWeight: 700 }}>{item.s}</div>
              <div style={{ color: C.muted, fontSize: 9 }}>{item.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rotating message */}
      <div style={{ color: C.gold, fontSize: 13, fontStyle: 'italic', textAlign: 'center', marginBottom: 24, minHeight: 20 }}>
        {MESSAGES[msgIdx]}
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: C.muted, fontSize: 12 }}>Preparing your VI report...</span>
          <span style={{ color: C.gold, fontWeight: 700 }}>{progress}%</span>
        </div>
        <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: G.gold, borderRadius: 3, transition: 'width .06s' }} />
        </div>
      </div>
    </div>
  )
}
