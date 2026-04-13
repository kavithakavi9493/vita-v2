import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, ProgressBar, OptionCard, Card, ScreenWrapper, BottomBar } from '../components/UI'
import { C } from '../constants/colors'

const QUESTIONS = [
  {
    key: 'q1', num: 'Q1',
    q: 'How is your daily energy level?',
    scoreKey: 'energyLevel',
    opts: [
      { v: 'High',   l: 'High',   sc: 10 },
      { v: 'Medium', l: 'Medium', sc: 6  },
      { v: 'Low',    l: 'Low',    sc: 3  },
    ],
  },
  {
    key: 'q2', num: 'Q2',
    q: 'Do you workout regularly?',
    scoreKey: 'workoutLevel',
    opts: [
      { v: 'Yes',        l: 'Yes (4-5x per week)',  sc: 10 },
      { v: 'Sometimes',  l: 'Occasionally (1-2x)',  sc: 5  },
      { v: 'No',         l: 'No / Rarely',          sc: 2  },
    ],
  },
  {
    key: 'q3', num: 'Q3',
    q: 'Do you feel fatigue often?',
    scoreKey: 'fatigueLevel',
    opts: [
      { v: 'Rarely',      l: 'Rarely',      sc: 5 },
      { v: 'Sometimes',   l: 'Sometimes',   sc: 3 },
      { v: 'Frequently',  l: 'Frequently',  sc: 2 },
    ],
  },
]

export default function Quiz1Screen() {
  const navigate = useNavigate()
  const { update } = useApp()
  const [answers, setAnswers] = useState({})

  const allDone = QUESTIONS.every(q => answers[q.key] != null)

  const calcScore = () =>
    QUESTIONS.reduce((total, q) => {
      const opt = q.opts.find(o => o.v === answers[q.key])
      return total + (opt?.sc || 0)
    }, 0)

  const handleContinue = () => {
    const score = calcScore()
    update({
      physicalScore: score,
      energyLevel:   answers.q1,
      workoutLevel:  answers.q2,
      fatigueLevel:  answers.q3,
    })
    navigate('/analyzing')
  }

  return (
    <ScreenWrapper>
      <div style={{ padding: '24px 24px 100px' }}>
        <ProgressBar step={3} total={5} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: C.goldBg, border: `1px solid ${C.goldBorder}`,
          borderRadius: 20, padding: '6px 14px', marginBottom: 14,
        }}>
          <span>💪</span>
          <span style={{ color: C.gold, fontSize: 13, fontWeight: 600 }}>Physical Health</span>
        </div>

        <div style={{ color: C.text, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>How is your body performing?</div>
        <div style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>Answer honestly for your most accurate VitaScore</div>

        {QUESTIONS.map(q => (
          <Card key={q.key} style={{ marginBottom: 14 }}>
            <div style={{
              background: C.goldBg, border: `1px solid ${C.goldBorder}`,
              borderRadius: 8, padding: '2px 10px', color: C.gold,
              fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 10,
            }}>
              {q.num}
            </div>
            <div style={{ color: C.text, fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{q.q}</div>
            {q.opts.map(o => (
              <OptionCard
                key={o.v} label={o.l}
                selected={answers[q.key] === o.v}
                onClick={() => setAnswers({ ...answers, [q.key]: o.v })}
                score={answers[q.key] === o.v ? `+${o.sc}` : null}
              />
            ))}
          </Card>
        ))}

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          {QUESTIONS.map(q => (
            <div key={q.key} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: answers[q.key] ? C.gold : C.border,
              transition: 'background .2s',
            }} />
          ))}
        </div>
      </div>

      <BottomBar>
        <GoldBtn onClick={handleContinue} disabled={!allDone}>Continue to Mental →</GoldBtn>
      </BottomBar>
    </ScreenWrapper>
  )
}
