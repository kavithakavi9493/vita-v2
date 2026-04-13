import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useApp } from '../context/AppContext'
import { GoldBtn, Toast, Spinner } from '../components/UI'
import { C } from '../constants/colors'

export default function OTPScreen() {
  const navigate  = useNavigate()
  const { state, update } = useApp()
  const [otp, setOtp]     = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [toast, setToast]         = useState(null)
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(v => v - 1), 1000)
      return () => clearTimeout(t)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleDigit = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 5) refs[i + 1].current?.focus()
  }

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus()
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      refs[5].current?.focus()
    }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 6) return
    setLoading(true)
    try {
      const result = await window.confirmationResult.confirm(code)
      const user = result.user
      const uid  = user.uid

      // Save user to Firestore
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)

      await setDoc(userRef, {
        name:      state.userName,
        phone:     state.phone,
        email:     state.email || '',
        createdAt: userSnap.exists() ? userSnap.data().createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
        currentStreak:  userSnap.data()?.currentStreak || 0,
        bestStreak:     userSnap.data()?.bestStreak || 0,
        lastLogDate:    userSnap.data()?.lastLogDate || null,
        notificationSettings: userSnap.data()?.notificationSettings || {
          dailyReminders: true,
          sessionAlerts:  true,
          progressNudges: true,
          offersUpdates:  false,
        },
      }, { merge: true })

      // Check if quiz was already completed
      const respSnap = await getDoc(doc(db, 'user_responses', uid))

      update({ userId: uid, isLoggedIn: true, hasCompletedQuiz: respSnap.exists() })

      if (respSnap.exists()) {
        const d = respSnap.data()
        update({
          lifestyleScore:   d.lifestyleScore   || 0,
          physicalScore:    d.physicalScore     || 0,
          mentalScore:      d.mentalScore       || 0,
          performanceScore: d.performanceScore  || 0,
          vitaScore:        d.vitaScore         || 0,
          ageGroup:         d.ageGroup          || '',
          planType:         d.planType          || 'advanced',
        })
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/routine', { replace: true })
      }
    } catch (err) {
      console.error(err)
      setToast({ msg: 'Invalid OTP. Please try again.', type: 'error' })
      setOtp(['', '', '', '', '', ''])
      refs[0].current?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = () => {
    setTimer(30)
    setCanResend(false)
    navigate('/signup')
  }

  const full = otp.every(d => d !== '')

  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg,#111111,#0A0A0A)' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <button onClick={() => navigate('/signup')} style={{ background: 'none', border: 'none', color: C.white, fontSize: 22, cursor: 'pointer' }}>←</button>
      </div>

      <div style={{ padding: '36px 24px', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: C.goldBg, border: `2px solid ${C.gold}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 30,
          boxShadow: '0 0 24px rgba(255,215,0,0.3)',
        }}>
          🔒
        </div>

        <div style={{ color: C.white, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>OTP Verification</div>
        <div style={{ color: C.muted, fontSize: 14, marginBottom: 4 }}>We sent a 6-digit code to</div>
        <div style={{ color: C.gold, fontSize: 15, fontWeight: 700, marginBottom: 36 }}>+91 {state.phone}</div>

        {/* OTP Boxes */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 36 }} onPaste={handlePaste}>
          {otp.map((d, i) => (
            <input
              key={i} ref={refs[i]} type="number" value={d} maxLength={1}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
              style={{
                width: 46, height: 56, background: C.card,
                border: `2px solid ${d ? C.gold : C.border}`,
                borderRadius: 12, color: C.white, fontSize: 22,
                fontWeight: 700, textAlign: 'center',
              }}
            />
          ))}
        </div>

        <GoldBtn onClick={handleVerify} disabled={!full || loading} style={{ marginBottom: 20 }}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </GoldBtn>

        <div style={{ color: C.muted, fontSize: 14, marginBottom: 14 }}>
          {canResend
            ? <span onClick={handleResend} style={{ color: C.gold, cursor: 'pointer', fontWeight: 700 }}>Resend OTP</span>
            : <>Resend in <span style={{ color: C.gold }}>{timer}s</span></>}
        </div>

        <div onClick={() => navigate('/signup')} style={{ color: C.muted, fontSize: 14, cursor: 'pointer' }}>
          Wrong number? <span style={{ color: C.gold }}>Change it</span>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
