import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, ProgressBar, ScreenWrapper, BottomBar } from '../components/UI'
import { C } from '../constants/colors'

const GROUPS = [
  { id: '18-25', label: '18 – 25', sub: 'Young & active'            },
  { id: '26-35', label: '26 – 35', sub: 'Peak performance years'    },
  { id: '36-45', label: '36 – 45', sub: 'Maintain & strengthen'     },
  { id: '45+',   label: '45 +',    sub: 'Restore & revitalise'      },
]

export default function AgeGroupScreen() {
  const navigate = useNavigate()
  const { update } = useApp()
  const [selected, setSelected] = useState(null)

  const handleContinue = () => {
    if (!selected) return
    update({ ageGroup: selected })
    navigate('/quiz-1')
  }

  return (
    <ScreenWrapper>
      <div style={{ padding: '24px 24px 100px' }}>
        <ProgressBar step={2} total={5} />

        <div style={{ textAlign: 'center', marginBottom: 6 }}>
          <div style={{ color: C.white, fontSize: 24, fontWeight: 700 }}>How Old Are You?</div>
          <div style={{ color: C.muted, fontSize: 14, marginTop: 6 }}>
            Age helps VI personalise your VitaScore accurately
          </div>
        </div>

        <div style={{ fontSize: 52, textAlign: 'center', margin: '24px 0' }}>👤</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GROUPS.map(g => (
            <div
              key={g.id}
              onClick={() => setSelected(g.id)}
              style={{
                background: selected === g.id ? C.goldBg : C.card,
                border: `2px solid ${selected === g.id ? C.gold : C.border}`,
                borderRadius: 16, padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', transition: 'all .2s',
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${selected === g.id ? C.gold : C.subtle}`,
                background: selected === g.id ? C.gold : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.onGold, fontSize: 12, fontWeight: 700,
              }}>
                {selected === g.id ? '✓' : ''}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.white, fontSize: 17, fontWeight: 700 }}>{g.label}</div>
                <div style={{ color: C.muted, fontSize: 13 }}>{g.sub}</div>
              </div>
              {selected === g.id && <span style={{ color: C.gold, fontSize: 18 }}>✓</span>}
            </div>
          ))}
        </div>
      </div>

      <BottomBar>
        <GoldBtn onClick={handleContinue} disabled={!selected}>Continue →</GoldBtn>
      </BottomBar>
    </ScreenWrapper>
  )
}
