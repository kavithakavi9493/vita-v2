import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { doc, deleteDoc } from 'firebase/firestore'

import { auth, db } from '../firebase'
import { useApp } from '../context/AppContext'
import { Toggle, ScreenWrapper } from '../components/UI'
import { C } from '../constants/colors'

export default function ProfileScreen() {

  const navigate = useNavigate()

  const { state, reset } = useApp()

  const {
    userName,
    phone,
    email,
    vitaScore,
    lifestyleScore,
    mentalScore,
    performanceScore,
    planType,
    ageGroup,
    userId
  } = state



  const [notifs, setNotifs] = useState({
    daily: true,
    session: true,
    prog: true,
    offers: false
  })

  const [showLogout, setShowLogout] = useState(false)

  const [showDelete, setShowDelete] = useState(false)



  const toggleNotif = (k) => {

    setNotifs(n => ({
      ...n,
      [k]: !n[k]
    }))
  }



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



  const Row = ({
    icon,
    label,
    sub,
    value,
    chevron = true,
    danger = false,
    onPress
  }) => (

    <div
      onClick={onPress}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: `1px solid ${C.border}`,
        cursor: onPress ? 'pointer' : 'default'
      }}
    >

      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: danger ? '#2A0000' : C.goldBg,
          border: `1px solid ${danger ? C.red : C.goldBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16
        }}
      >
        {icon}
      </div>



      <div style={{ flex: 1 }}>

        <div
          style={{
            color: danger ? C.red : C.text,
            fontSize: 14,
            fontWeight: 500
          }}
        >
          {label}
        </div>

        {sub && (

          <div
            style={{
              color: C.muted,
              fontSize: 11
            }}
          >
            {sub}
          </div>

        )}

      </div>



      {value && (

        <div
          style={{
            color: C.gold,
            fontSize: 12,
            fontWeight: 600
          }}
        >
          {value}
        </div>

      )}



      {chevron && !value && (

        <div
          style={{
            color: C.muted
          }}
        >
          ›
        </div>

      )}

    </div>

  )



  return (

    <ScreenWrapper>

      <div
        style={{
          background: C.bgMid,
          padding: '20px'
        }}
      >

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



        <div style={{ textAlign: 'center' }}>

          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: C.gold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 700,
              color: C.onGold,
              margin: '0 auto 10px'
            }}
          >
            {(userName || 'U')[0]}
          </div>



          <div
            style={{
              color: C.text,
              fontSize: 20,
              fontWeight: 700
            }}
          >
            {userName || 'User'}
          </div>



          <div
            style={{
              color: C.muted
            }}
          >
            +91 {phone}
          </div>

        </div>

      </div>



      <div style={{ padding: 20 }}>

        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 16,
            marginBottom: 14
          }}
        >

          <div
            style={{
              color: C.gold,
              fontSize: 12,
              fontWeight: 700
            }}
          >
            PERSONAL INFORMATION
          </div>



          <Row icon="👤" label="Full Name" value={userName} />

          <Row icon="📱" label="Phone" value="Verified" />

          <Row icon="✉️" label="Email" value={email || 'Not added'} />

          <Row icon="🎂" label="Age Group" value={ageGroup} />

        </div>



        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 16,
            marginBottom: 14
          }}
        >

          <div
            style={{
              color: C.gold,
              fontSize: 12,
              fontWeight: 700
            }}
          >
            MY SCORES
          </div>



          <Row label="VitaScore" value={vitaScore} />

          <Row label="Lifestyle" value={lifestyleScore} />

          <Row label="Mental" value={mentalScore} />

          <Row label="Performance" value={performanceScore} />

        </div>



        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 16,
            marginBottom: 14
          }}
        >

          <div
            style={{
              color: C.gold,
              fontSize: 12,
              fontWeight: 700
            }}
          >
            NOTIFICATIONS
          </div>



          {['daily','session','prog','offers'].map(k => (

            <div
              key={k}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 10
              }}
            >

              <div style={{ color: C.text }}>{k}</div>

              <Toggle
                on={notifs[k]}
                onToggle={() => toggleNotif(k)}
              />

            </div>

          ))}

        </div>



        <button
          onClick={() => setShowLogout(true)}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 12,
            background: C.orange,
            border: 'none',
            color: C.white,
            fontWeight: 600,
            marginBottom: 10
          }}
        >
          Log out
        </button>



        <button
          onClick={() => setShowDelete(true)}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 12,
            background: C.red,
            border: 'none',
            color: C.white,
            fontWeight: 600
          }}
        >
          Delete account
        </button>

      </div>



      {showLogout && (

        <div>

          <button onClick={handleLogout}>
            Confirm logout
          </button>

        </div>

      )}



      {showDelete && (

        <div>

          <button onClick={handleDelete}>
            Confirm delete
          </button>

        </div>

      )}

    </ScreenWrapper>

  )

}
