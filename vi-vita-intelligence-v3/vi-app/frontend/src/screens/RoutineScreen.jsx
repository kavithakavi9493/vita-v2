import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, ProgressBar, Toast, ScreenWrapper, BottomBar } from '../components/UI'
import { C, G } from '../constants/colors'

const ROWS = [
  { icon: '☀️', label: 'Wake Up Time',   sub: 'What time do you wake up?' },
  { icon: '☕', label: 'Breakfast Time', sub: 'First meal of the day'      },
  { icon: '🍽️', label: 'Lunch Time',     sub: 'Midday meal time'           },
  { icon: '🌆', label: 'Dinner Time',    sub: 'Evening meal time'          },
  { icon: '🌙', label: 'Sleep Time',     sub: 'When do you sleep?'         },
]

function calcLifestyleScore(times) {
  let score = 0
  const sleepH  = parseInt(times[4].split(':')[0])
  const wakeH   = parseInt(times[0].split(':')[0])
  const dinnerH = parseInt(times[3].split(':')[0])

  // Sleep score
  if (sleepH >= 20 && sleepH <= 23) score += 10
  else if (sleepH === 0)            score += 7
  else                              score += 3

  // Wake score
  if (wakeH <= 7)      score += 10
  else if (wakeH <= 9) score += 7
  else                 score += 3

  // Dinner score
  if (dinnerH <= 21) score += 5
  else               score += 2

  return Math.min(score, 25)
}

export default function RoutineScreen() {
  const navigate = useNavigate()
  const { update } = useApp()
  const [times, setTimes] = useState(['06:00', '08:00', '13:00', '20:00', '22:30'])
  const [toast, setToast] = useState(null)

  const handleContinue = () => {
    const score = calcLifestyleScore(times)
    update({
      wakeTime:      times[0],
      breakfastTime: times[1],
      lunchTime:     times[2],
      dinnerTime:    times[3],
      sleepTime:     times[4],
      lifestyleScore: score,
    })
    navigate('/age-group')
  }

  return (
    <ScreenWrapper>
      <div style={{ padding: '24px 24px 100px' }}>
        <ProgressBar step={1} total={5} />

        <div style={{ marginBottom: 24 }}>
          <div style={{ color: C.text, fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Your Daily Routine</div>
          <div style={{ color: C.muted, fontSize: 14 }}>Help us understand your lifestyle to calculate your VitaScore</div>
          <div style={{ color: C.gold, fontSize: 12, fontStyle: 'italic', marginTop: 4 }}>VI needs this to personalise your plan</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ROWS.map((row, i) => (
            <div key={i} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 16, padding: 16,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: C.goldBg, border: `1px solid ${C.goldBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                {row.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{row.label}</div>
                <div style={{ color: C.muted, fontSize: 12 }}>{row.sub}</div>
              </div>
              <input
                type="time"
                value={times[i]}
                onChange={e => {
                  const n = [...times]
                  n[i] = e.target.value
                  setTimes(n)
                }}
                style={{
                  background: C.goldBg, border: `1px solid ${C.goldBorder}`,
                  borderRadius: 8, color: C.gold, fontSize: 13,
                  fontWeight: 700, padding: '6px 10px',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <BottomBar>
        <GoldBtn onClick={handleContinue}>Continue →</GoldBtn>
      </BottomBar>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </ScreenWrapper>
  )
}
