import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { VILogo, Card } from '../components/UI'
import { C, G } from '../constants/colors'

const MESSAGES = [
  'Analyzing your responses...',
  'Understanding your lifestyle...',
  'Calculating your vitality...',
  'Checking physical health...',
  'Reading mental patterns...',
  'Almost there...',
]

const CHECKS = [
  'Lifestyle & Routine Analysed',
  'Physical Health Scanned',
  'Mental Wellbeing Profiled',
]

export default function AnalyzingScreen() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [msgIdx,   setMsgIdx]   = useState(0)
  const [checks,   setChecks]   = useState([false, false, false])

  useEffect(() => {
    const mInt  = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 1500)
    const pInt  = setInterval(() => setProgress(v => Math.min(v + 1, 100)), 45)
    const c1    = setTimeout(() => setChecks([true, false, false]), 1500)
    const c2    = setTimeout(() => setChecks([true, true,  false]), 2800)
    const c3    = setTimeout(() => setChecks([true, true,  true]),  4000)
    const done  = setTimeout(() => navigate('/quiz-2', { replace: true }), 4600)
    return () => [mInt, pInt, c1, c2, c3, done].forEach(clearTimeout)
  }, [navigate])

  return (
    <div style={{
      width: '100%', height: '100%', background: C.bgDeep,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      {/* Spinning ring around logo */}
      <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 32 }}>
        <div className="spin" style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `3px solid ${C.border}`, borderTopColor: C.gold,
        }} />
        <div style={{ position: 'absolute', inset: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <VILogo size={78} />
        </div>
      </div>

      <div style={{ color: C.text, fontSize: 21, fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>
        VI is Analysing Your Health
      </div>
      <div style={{ color: C.gold, fontSize: 12, fontStyle: 'italic', marginBottom: 28 }}>
        Powered by Vita Intelligence
      </div>

      <div style={{ color: C.muted, fontSize: 14, marginBottom: 28, minHeight: 20, textAlign: 'center' }}>
        {MESSAGES[msgIdx]}
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: C.muted, fontSize: 13 }}>Analysing...</span>
          <span style={{ color: C.gold, fontWeight: 700, fontSize: 16 }}>{progress}%</span>
        </div>
        <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: G.gold, borderRadius: 3, transition: 'width .05s' }} />
        </div>
      </div>

      {/* Check items */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {CHECKS.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: checks[i] ? 1 : 0.25, transition: 'opacity .5s' }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: checks[i] ? C.gold : C.border,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, transition: 'all .3s',
            }}>
              {checks[i] ? '✓' : ''}
            </div>
            <span style={{ color: C.text, fontSize: 14 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Tip card */}
      <Card style={{ width: '100%', padding: 14 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <span>💡</span>
          <div>
            <div style={{ color: C.gold, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Did you know?</div>
            <div style={{ color: C.muted, fontSize: 12 }}>
              Men with regular sleep patterns score 40% higher on vitality assessments.
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
