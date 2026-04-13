import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useApp } from '../context/AppContext'
import { GoldBtn, ProgressBar, OptionCard, Card, ScreenWrapper, BottomBar, Toast } from '../components/UI'
import { C } from '../constants/colors'

const QUESTIONS = [
  {
    key: 'q7', num: 'Q7',
    q: 'How is your libido (desire)?',
    opts: [
      { v: 'High',     l: 'High',     sub: 'Strong desire regularly',    sc: 10 },
      { v: 'Moderate', l: 'Moderate', sub: 'Present but not always',     sc: 6  },
      { v: 'Low',      l: 'Low',      sub: 'Rarely feel the desire',     sc: 3  },
    ],
  },
  {
    key: 'q8', num: 'Q8',
    q: 'Do you face timing or control issues?',
    opts: [
      { v: 'No',        l: 'No',        sub: 'No issues at all',          sc: 10 },
      { v: 'Sometimes', l: 'Sometimes', sub: 'Occasional difficulty',     sc: 6  },
      { v: 'Often',     l: 'Often',     sub: 'Happens frequently',        sc: 2  },
    ],
  },
  {
    key: 'q9', num: 'Q9',
    q: 'How is your erection quality?',
    opts: [
      { v: 'Strong',   l: 'Strong',   sub: 'Consistent and reliable',   sc: 5 },
      { v: 'Moderate', l: 'Moderate', sub: 'Sometimes inconsistent',    sc: 3 },
      { v: 'Weak',     l: 'Weak',     sub: 'Often unsatisfactory',      sc: 2 },
    ],
  },
]

export default function Quiz3Screen() {
  const navigate = useNavigate()
  const { state, update } = useApp()
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [toast,   setToast]   = useState(null)

  const allDone = QUESTIONS.every(q => answers[q.key] != null)

  const calcScore = () =>
    QUESTIONS.reduce((total, q) => {
      const opt = q.opts.find(o => o.v === answers[q.key])
      return total + (opt?.sc || 0)
    }, 0)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const perfScore = calcScore()
      let vitaScore = state.lifestyleScore + state.physicalScore + state.mentalScore + perfScore

      // Age deduction
      if (state.ageGroup === '36-45') vitaScore -= 2
      if (state.ageGroup === '45+')   vitaScore -= 4
      vitaScore = Math.max(0, Math.min(100, vitaScore))

      const responseData = {
        userId:           state.userId,
        lifestyleScore:   state.lifestyleScore,
        physicalScore:    state.physicalScore,
        mentalScore:      state.mentalScore,
        performanceScore: perfScore,
        vitaScore,
        ageGroup:         state.ageGroup,
        energyLevel:      state.energyLevel,
        workoutLevel:     state.workoutLevel,
        fatigueLevel:     state.fatigueLevel,
        stressLevel:      state.stressLevel,
        anxietyLevel:     state.anxietyLevel,
        focusLevel:       state.focusLevel,
        libidoLevel:      answers.q7,
        timingControl:    answers.q8,
        erectionQuality:  answers.q9,
        completedAt:      serverTimestamp(),
      }

      if (state.userId) {
        await setDoc(doc(db, 'user_responses', state.userId), responseData)
      }

      update({
        performanceScore: perfScore,
        vitaScore,
        libidoLevel:     answers.q7,
        timingControl:   answers.q8,
        erectionQuality: answers.q9,
        hasCompletedQuiz: true,
      })

      navigate('/final-loading', { replace: true })
    } catch (err) {
      console.error(err)
      setToast({ msg: 'Error saving responses. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper>
      <div style={{ padding: '24px 24px 110px' }}>
        <ProgressBar step={5} total={5} />

        {/* Privacy banner */}
        <div style={{
          background: C.goldBg, border: `1px solid ${C.gold}`,
          borderRadius: 12, padding: '12px 16px', marginBottom: 18,
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <span>🔒</span>
          <span style={{ color: C.gold, fontSize: 13 }}>
            Your answers are 100% private &amp; confidential. VI never shares your data.
          </span>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: C.goldBg, border: `1px solid ${C.goldBorder}`,
          borderRadius: 20, padding: '6px 14px', marginBottom: 14,
        }}>
          <span>⚡</span>
          <span style={{ color: C.gold, fontSize: 13, fontWeight: 600 }}>Performance</span>
        </div>

        <div style={{ color: C.white, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Your Performance Health</div>
        <div style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>
          Most important section for your personalised VI plan
        </div>

        {QUESTIONS.map(q => (
          <Card key={q.key} style={{ marginBottom: 14 }}>
            <div style={{
              background: C.goldBg, border: `1px solid ${C.goldBorder}`,
              borderRadius: 8, padding: '2px 10px', color: C.gold,
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

        {/* Encouragement */}
        <Card style={{ padding: 14, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <span>❤️</span>
            <span style={{ color: C.muted, fontSize: 13 }}>
              Thousands of men have improved their performance with the right plan.
              You're one step away from yours.
            </span>
          </div>
        </Card>

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
        <GoldBtn onClick={handleSubmit} disabled={!allDone || loading} height={60} style={{ fontSize: 17 }}>
          {loading ? 'Saving...' : 'See My VitaScore 🎯'}
        </GoldBtn>
      </BottomBar>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </ScreenWrapper>
  )
}
