import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn } from '../components/UI'
import { C, G } from '../constants/colors'

// ── Day 1 Usage Guide ─────────────────────────────────────
const DAY1_GUIDE = [
  { time: '7:00 AM', action: 'Morning Vitality Shot — take on empty stomach with warm water', icon: '🌅' },
  { time: '8:30 AM', action: 'Vajra Veerya — 2 capsules after breakfast with warm milk', icon: '💊' },
  { time: '8:00 PM', action: 'Evening formula — as per your custom stack', icon: '🌙' },
  { time: '10:00 PM', action: 'Night Recovery — 1 scoop in warm water before sleep', icon: '😴' },
]

export function SuccessScreen() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { planType, selectedAmount, userName } = state
  const orderId = `VI${Date.now().toString().slice(-8)}`
  const [step, setStep] = useState('celebration') // celebration | guide | whatsapp

  if (step === 'guide') {
    return (
      <div style={{ width: '100%', height: '100%', background: C.bgMid, overflowY: 'auto' }}>
        <div style={{ background: G.hero, padding: '24px 20px 20px' }}>
          <div style={{ color: '#FFD700', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Day 1 Usage Guide 📋</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Your complete protocol starts the day your kit arrives</div>
        </div>
        <div style={{ padding: '16px 20px 100px' }}>
          {DAY1_GUIDE.map((item, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 10, display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: C.goldBg, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 20, padding: '2px 8px', color: C.gold, fontSize: 11, fontWeight: 700, display: 'inline-block', marginBottom: 4 }}>{item.time}</div>
                <div style={{ color: C.text, fontSize: 13, lineHeight: 1.5 }}>{item.action}</div>
              </div>
            </div>
          ))}

          <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <div style={{ color: C.gold, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>⏱️ Results Timeline</div>
            {[['Day 15', 'Noticeable energy improvement'], ['Day 30', 'Performance transformation begins'], ['Day 90', 'Complete protocol achieved']].map(([day, label]) => (
              <div key={day} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                <div style={{ background: G.gold, borderRadius: 20, padding: '2px 8px', color: C.onGold, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{day}</div>
                <div style={{ color: C.text, fontSize: 12 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ position: 'sticky', bottom: 16 }}>
            <GoldBtn onClick={() => navigate('/dashboard', { replace: true })} height={56}>
              Go to My VI Dashboard →
            </GoldBtn>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', background: C.bgMid, overflowY: 'auto', padding: '0 0 40px' }}>
      {/* Celebration header */}
      <div style={{ background: G.hero, padding: '40px 24px 30px', textAlign: 'center' }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(34,197,94,0.2)', border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 46, boxShadow: '0 0 30px rgba(34,197,94,0.3)' }}>🎉</div>
        <div style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Your Transformation Has Started!</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6 }}>
          {userName ? `${userName}, your` : 'Your'} VI kit is being packed with care.<br />
          Delivery in 5–7 business days.
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Order details */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Order Confirmed ✅</div>
          {[
            { l: 'Order ID',       v: `#${orderId}` },
            { l: 'Plan',           v: `${(planType || 'advanced').charAt(0).toUpperCase()}${(planType || 'advanced').slice(1)} Plan` },
            { l: 'Amount Paid',    v: `₹${(selectedAmount || 1999).toLocaleString()}` },
            { l: 'Est. Delivery',  v: '5–7 business days' },
            { l: 'Tracking',       v: 'SMS + WhatsApp updates' },
          ].map(item => (
            <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.muted, fontSize: 13 }}>{item.l}</span>
              <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{item.v}</span>
            </div>
          ))}
        </div>

        {/* What happens next */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 14 }}>What Happens Next</div>
          {[
            { i: '📦', step: 'Kit packed & dispatched', t: 'Within 24 hours' },
            { i: '🚚', step: 'Delivery to your door',   t: '5–7 business days' },
            { i: '📱', step: 'Tracking link via WhatsApp', t: 'Automatic updates' },
            { i: '👨‍⚕️', step: 'Expert calls scheduling',  t: 'Within 48 hours' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 3 ? 12 : 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: C.goldBg, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.i}</div>
              <div>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{item.step}</div>
                <div style={{ color: C.gold, fontSize: 11 }}>{item.t}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Results reminder */}
        <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ color: C.gold, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>⏱️ Your Protocol Promise</div>
          <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>
            Use your VI formulas <b>every day without fail</b>. You'll feel real changes within <b>15 days</b>. For lasting transformation — your full <b>3-month protocol</b> is where the magic happens.
          </div>
        </div>

        {/* WhatsApp opt-in */}
        <div style={{ background: '#F0FDF4', border: `1px solid #BBF7D0`, borderRadius: 16, padding: 16, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 22 }}>💬</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Get WhatsApp Reminders</div>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>Day 3 & Day 7 check-ins + expert tips to maximise your results.</div>
            <button onClick={() => window.open(`https://wa.me/91XXXXXXXXXX?text=Hi! I just placed my VI order #${orderId}. Please add me for daily reminders.`, '_blank')}
              style={{ background: '#25D366', border: 'none', borderRadius: 10, padding: '8px 16px', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              📱 Enable WhatsApp Reminders
            </button>
          </div>
        </div>

        {/* CTAs */}
        <GoldBtn onClick={() => setStep('guide')} style={{ marginBottom: 10 }} height={52}>
          📋 View Day 1 Usage Guide
        </GoldBtn>
        <GoldBtn onClick={() => navigate('/dashboard', { replace: true })} outline height={52}>
          Go to My Dashboard →
        </GoldBtn>
      </div>
    </div>
  )
}

export function FailureScreen() {
  const navigate  = useNavigate()
  const { state } = useApp()
  const { selectedAmount } = state

  return (
    <div style={{ width: '100%', height: '100%', background: C.bgMid, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#FEF2F2', border: `2px solid ${C.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, fontSize: 46 }}>❌</div>
      <div style={{ color: C.text, fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Payment Failed</div>
      <div style={{ color: C.muted, fontSize: 14, textAlign: 'center', marginBottom: 8, lineHeight: 1.6 }}>
        Don't worry — no amount was deducted.<br />Please try again.
      </div>
      <div style={{ color: C.subtle, fontSize: 12, marginBottom: 28 }}>Error: PAYMENT_DECLINED</div>
      <GoldBtn onClick={() => navigate('/checkout')} style={{ marginBottom: 12 }}>Try Again</GoldBtn>
      <button onClick={() => {
        const msg = encodeURIComponent(`Hi, my payment failed. Order amount: ₹${selectedAmount || 1999}. Please help.`)
        window.open(`https://wa.me/91XXXXXXXXXX?text=${msg}`, '_blank')
      }} style={{ width: '100%', height: 52, borderRadius: 14, border: `2px solid ${C.gold}`, background: 'transparent', color: C.gold, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
        Contact Support via WhatsApp
      </button>
    </div>
  )
}
