import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '../firebase'
import { useApp } from '../context/AppContext'
import { VILogo, GoldBtn, FocusInput, Toast } from '../components/UI'
import { C, G } from '../constants/colors'

export default function SignupScreen() {
  const navigate = useNavigate()
  const { update } = useApp()
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const validate = () => {
    const e = {}
    if (!name || name.trim().length < 3) e.name = 'Please enter your full name (min 3 chars)'
    if (!phone || phone.replace(/\D/g, '').length !== 10) e.phone = 'Enter valid 10-digit number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSendOTP = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      // Setup reCAPTCHA
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {},
        })
      }
      const fullPhone = `+91${phone.replace(/\D/g, '')}`
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier)
      window.confirmationResult = confirmationResult

      update({ userName: name.trim(), phone: phone.replace(/\D/g, ''), email })
      navigate('/otp')
    } catch (err) {
      console.error(err)
      setToast({ msg: err.message || 'Failed to send OTP. Please try again.', type: 'error' })
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = null
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.bgMid, overflowY: 'auto' }}>
      <div style={{ padding: '52px 24px 48px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <VILogo size={72} />
          <div style={{ color: C.gold, fontSize: 22, fontWeight: 800, letterSpacing: 7, marginTop: 12 }}>VI</div>
          <div style={{ color: C.muted, fontSize: 10, letterSpacing: 4 }}>VITA INTELLIGENCE</div>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ color: C.text, fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Let's Get Started</div>
          <div style={{ color: C.muted, fontSize: 14 }}>Enter your details to discover your VitaScore</div>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          <div>
            <FocusInput placeholder="Your full name" value={name} onChange={setName} />
            {errors.name && <div style={{ color: C.red, fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
          </div>
          <div>
            <div style={{
              display: 'flex', background: C.card, borderRadius: 12,
              border: `1px solid ${errors.phone ? C.red : C.border}`, height: 54, overflow: 'hidden',
            }}>
              <div style={{ background: C.goldBg, padding: '0 14px', borderRight: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', color: C.gold, fontSize: 14, fontWeight: 700 }}>
                +91
              </div>
              <input
                type="tel" placeholder="10-digit mobile number"
                value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                style={{ background: 'transparent', border: 'none', color: C.text, fontSize: 15, padding: '0 16px', flex: 1 }}
              />
            </div>
            {errors.phone && <div style={{ color: C.red, fontSize: 12, marginTop: 4 }}>{errors.phone}</div>}
          </div>
          <FocusInput placeholder="Email (optional)" value={email} onChange={setEmail} type="email" />
        </div>

        <div id="recaptcha-container" />

        <GoldBtn onClick={handleSendOTP} disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP →'}
        </GoldBtn>

        <div style={{ textAlign: 'center', marginTop: 24, color: C.muted, fontSize: 12 }}>
          By continuing you agree to our{' '}
          <span style={{ color: C.gold, cursor: 'pointer' }}>Terms of Service</span> &amp;{' '}
          <span style={{ color: C.gold, cursor: 'pointer' }}>Privacy Policy</span>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
