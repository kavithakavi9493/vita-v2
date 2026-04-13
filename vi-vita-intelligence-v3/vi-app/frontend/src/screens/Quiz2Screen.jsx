import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, ProgressBar, OptionCard, Card, ScreenWrapper, BottomBar } from '../components/UI'
import { C } from '../constants/colors'

const QUESTIONS = [
  {
    key: 'q4', num: 'Q4',
    q: 'What is your stress level?',
    opts: [
      { v: 'Low',      l: 'Low',      sub: 'I manage stress well',           sc: 10 },
      { v: 'Moderate', l: 'Moderate', sub: 'Some stress but manageable',     sc: 6  },
      { v: 'High',     l: 'High',     sub: 'Stressed most of the time',      sc: 2  },
    ],
  },
  {
    key: 'q5', num: 'Q5',
    q: 'Do you feel performance anxiety?',
    opts: [
      { v: 'No',        l: 'No',        sub: 'I feel confident always',       sc: 10 },
      { v: 'Sometimes', l: 'Sometimes', sub: 'Occasional nervousness',        sc: 5  },
      { v: 'Often',     l: 'Often',     sub: 'It affects me regularly',       sc: 2  },
    ],
  },
  {
    key: 'q6', num: 'Q6',
    q: 'How is your focus and mental clarity?',
    opts: [
      { v: 'Good',    l: 'Good',    sub: 'Sharp and focused daily',          sc: 5 },
      { v: 'Average', l: 'Average', sub: 'Sometimes distracted',             sc: 3 },
      { v: 'Poor',    l: 'Poor',    sub: 'Hard to concentrate',              sc: 2 },
    ],
  },
]

export default function Quiz2Screen() {
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
      mentalScore:  score,
      stressLevel:  answers.q4,
      anxietyLevel: answers.q5,
      focusLevel:   answers.q6,
    })
    navigate('/quiz-3')
  }

  return (
    <ScreenWrapper>
      <div style={{ padding: '24px 24px 100px' }}>
        <ProgressBar step={4} total={5} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: C.purpleBg, border: `1px solid ${C.purple}`,
          borderRadius: 20, padding: '6px 14px', marginBottom: 14,
        }}>
          <span>🧠</span>
          <span style={{ color: C.purple, fontSize: 13, fontWeight: 600 }}>Mental Health</span>
        </div>

        <div style={{ color: C.white, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>How is your mind doing?</div>
        <div style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>
          Mental health directly impacts your vitality score
        </div>

        {QUESTIONS.map(q => (
          <Card key={q.key} style={{ marginBottom: 14 }}>
            <div style={{
              background: C.purpleBg, border: `1px solid ${C.purple}`,
              borderRadius: 8, padding: '2px 10px', color: C.purple,
              fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 10,
            }}>
              {q.num}
            </div>
            <div style={{ color: C.white, fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{q.q}</div>
            {q.opts.map(o => (
              <OptionCard
                key={o.v} label={o.l} sub={o.sub}
                selected={answers[q.key] === o.v}
                onClick={() => setAnswers({ ...answers, [q.key]: o.v })}
                score={answers[q.key] === o.v ? `+${o.sc}` : null}
              />
            ))}
          </Card>
        ))}

        {/* Info card */}
        <div style={{
          background: C.card, border: `1px solid ${C.purple}`,
          borderRadius: 14, padding: 14, marginBottom: 20,
        }}>
          <span style={{ color: C.purple, fontSize: 13 }}>
            🧠 Stress is the #1 hidden factor affecting male vitality.
            Be honest for your most accurate VI score.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {QUESTIONS.map(q => (
            <div key={q.key} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: answers[q.key] ? C.gold : C.border, transition: 'background .2s',
            }} />
          ))}
        </div>
      </div>

      <BottomBar>
        <GoldBtn onClick={handleContinue} disabled={!allDone}>Continue to Performance →</GoldBtn>
      </BottomBar>
    </ScreenWrapper>
  )
}
