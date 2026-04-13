import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { doc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useApp } from '../context/AppContext'
import { Toggle, ScreenWrapper, Divider } from '../components/UI'
import { C } from '../constants/colors'

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { state, update, reset } = useApp()
  const { userName, phone, email, vitaScore, lifestyleScore, mentalScore, performanceScore, planType, ageGroup, userId } = state

  const [notifs, setNotifs] = useState({ daily: true, session: true, prog: true, offers: false })
  const [showLogout, setShowLogout] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const toggleNotif = (k) => setNotifs(n => ({ ...n, [k]: !n[k] }))

  const handleLogout = async () => {
    await signOut(auth)
    reset()
    navigate('/', { replace: true })
  }

  const handleDelete = async () => {
    if (userId) {
      await deleteDoc(doc(db, 'users', userId))
      await deleteDoc(doc(db, 'user_responses', userId))
    }
    await signOut(auth)
    reset()
    navigate('/', { replace: true })
  }

  const Row = ({ icon, label, sub, value, chevron = true, danger = false, onPress }) => (
    <div onClick={onPress} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.border}`, cursor: onPress ? 'pointer' : 'default' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: danger ? '#2A0000' : C.goldBg, border: `1px solid ${danger ? C.red : C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: danger ? C.red : C.text, fontSize: 14, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>{sub}</div>}
      </div>
      {value && <div style={{ color: C.gold, fontSize: 12, fontWeight: 600 }}>{value}</div>}
      {chevron && !value && <div style={{ color: C.muted, fontSize: 16 }}>›</div>}
    </div>
  )

  return (
    <ScreenWrapper>

      {/* Header */}
      <div style={{ background: C.bgMid, padding: '20px 20px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>

          {/* FIXED HERE */}
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: C.text,
              fontSize: 22,
              cursor: 'pointer'
            }}
          >
            ←
          </button>

          <div style={{ color: C.text, fontSize: 18, fontWeight: 700 }}>
            My Profile
          </div>

          <div style={{
            border: `1px solid ${C.gold}`,
            borderRadius: 20,
            padding: '4px 14px',
            color: C.gold,
            fontSize: 12,
            cursor: 'pointer'
          }}>
            Edit
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: C.gold,
            border: `2px solid ${C.goldDark}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            fontSize: 32,
            fontWeight: 700,
            color: C.onGold
          }}>
            {(userName || 'U')[0]}
          </div>

          <div style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>
            {userName || 'User'}
          </div>

          <div style={{ color: C.muted, fontSize: 14 }}>
            📱 +91 {phone}
          </div>

          {email &&
            <div style={{ color: C.muted, fontSize: 14 }}>
              ✉ {email}
            </div>
          }

          <div style={{
            background: C.goldBg,
            border: `1px solid ${C.gold}`,
            borderRadius: 20,
            padding: '4px 14px',
            color: C.gold,
            fontSize: 12,
            display: 'inline-block',
            marginTop: 8
          }}>
            {(planType || 'Free').charAt(0).toUpperCase() + (planType || 'free').slice(1)} Plan · Member since Apr 2025
          </div>

        </div>
      </div>

      {/* Score */}
      <div style={{
        margin: '14px 20px',
        background: C.card,
        border: `1px solid ${C.gold}`,
        borderRadius: 12,
        padding: '13px 16px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr'
        }}>

          {[
            { v: vitaScore, l: 'VitaScore', c: C.text },
            { v: lifestyleScore, l: 'Lifestyle', c: C.gold },
            { v: mentalScore, l: 'Mental', c: C.purple },
            { v: performanceScore, l: 'Perform', c: C.gold }
          ].map((s, i) => (
            <div key={s.l} style={{
              textAlign: 'center',
              borderLeft: i > 0 ? `1px solid ${C.border}` : 'none'
            }}>
              <div style={{
                color: s.c,
                fontSize: 17,
                fontWeight: 700
              }}>
                {s.v}
              </div>

              <div style={{
                color: C.muted,
                fontSize: 10
              }}>
                {s.l}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* rest unchanged */}
    </ScreenWrapper>
  )
}
