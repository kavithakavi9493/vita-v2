import { createContext, useContext, useState, useEffect } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const AppContext = createContext(null)

const defaultState = {
  // Auth
  userId:    null,
  userName:  '',
  phone:     '',
  email:     '',
  isLoggedIn: false,
  hasCompletedQuiz: false,

  // Quiz inputs
  ageGroup:       '',
  wakeTime:       '06:00',
  breakfastTime:  '08:00',
  lunchTime:      '13:00',
  dinnerTime:     '20:00',
  sleepTime:      '22:30',

  // Quiz answers
  energyLevel:    '',
  workoutLevel:   '',
  fatigueLevel:   '',
  stressLevel:    '',
  anxietyLevel:   '',
  focusLevel:     '',
  libidoLevel:    '',
  timingControl:  '',
  erectionQuality:'',

  // Scores
  lifestyleScore:   0,
  physicalScore:    0,
  mentalScore:      0,
  performanceScore: 0,
  vitaScore:        0,

  // Body type + recommendation (set after quiz)
  bodyTypeId:       '',
  recommendedPlan:  '',

  // Plan selection
  planType:       'advanced',
  selectedAmount: 3999,
}

// ── Save quiz answers progressively to Firestore ──────────
async function persistQuizStep(userId, updates) {
  if (!userId) return
  try {
    const quizFields = [
      'ageGroup', 'energyLevel', 'workoutLevel', 'fatigueLevel',
      'stressLevel', 'anxietyLevel', 'focusLevel', 'libidoLevel',
      'timingControl', 'erectionQuality', 'lifestyleScore',
      'physicalScore', 'mentalScore', 'performanceScore', 'vitaScore',
      'bodyTypeId', 'recommendedPlan', 'hasCompletedQuiz',
    ]
    const quizData = {}
    for (const key of quizFields) {
      if (key in updates) quizData[key] = updates[key]
    }
    if (Object.keys(quizData).length === 0) return

    await setDoc(doc(db, 'quizResults', userId), {
      userId,
      ...quizData,
      updatedAt: serverTimestamp(),
    }, { merge: true })
  } catch (err) {
    // Non-blocking — quiz continues even if Firestore is unavailable
    console.warn('Quiz persistence skipped:', err.message)
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('vi_app_state')
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState
    } catch {
      return defaultState
    }
  })

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('vi_app_state', JSON.stringify(state))
  }, [state])

  const update = (updates) => {
    setState(s => {
      const next = { ...s, ...updates }
      // Progressively save quiz data to Firestore
      if (next.userId) {
        persistQuizStep(next.userId, updates)
      }
      return next
    })
  }

  const reset = () => {
    localStorage.removeItem('vi_app_state')
    setState(defaultState)
  }

  return (
    <AppContext.Provider value={{ state, update, reset }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
