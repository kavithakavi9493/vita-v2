import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { VILogo, Spinner } from '../components/UI'
import { C, G } from '../constants/colors'

const MESSAGES = [
  'Initialising VI...',
  'Loading your profile...',
  'Ancient wisdom meets AI...',
  'Almost ready...',
]

export default function SplashScreen() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [progress, setProgress] = useState(0)
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const mInt = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 850)
    const pInt = setInterval(() => setProgress(v => Math.min(v + 2, 100)), 62)

    const timer = setTimeout(() => {
      if (state.isLoggedIn && state.hasCompletedQuiz) {
        navigate('/dashboard', { replace: true })
      } else if (state.isLoggedIn) {
        navigate('/routine', { replace: true })
      } else {
        navigate('/signup', { replace: true })
      }
    }, 3200)

    return () => {
      clearInterval(mInt)
      clearInterval(pInt)
      clearTimeout(timer)
    }
  }, [navigate, state.isLoggedIn, state.hasCompletedQuiz])

  return (
    <div style={{
      width: '100%', height: '100%',
      background: G.hero,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="pulse-gold">
        <VILogo size={100} />
      </div>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <div style={{ color: '#FFFFFF', fontSize: 38, fontWeight: 800, letterSpacing: 10 }}>VI</div>
        <div style={{ color: '#FFD700', fontSize: 11, letterSpacing: 6, marginTop: 4 }}>VITA INTELLIGENCE</div>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 14, fontStyle: 'italic' }}>
          Intelligent Vitality. Ancient Wisdom.
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Siddha Science', 'AI-Powered', 'For Men'].map(t => (
            <div key={t} style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.35)', borderRadius: 20, padding: '3px 10px', color: '#FFD700', fontSize: 10, fontWeight: 600 }}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 56, left: 32, right: 32, textAlign: 'center' }}>
        <Spinner size={30} color="#FFD700" />
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 14, marginBottom: 14 }}>
          {MESSAGES[msgIdx]}
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: G.gold, borderRadius: 2, transition: 'width .06s' }} />
        </div>
      </div>
    </div>
  )
}
