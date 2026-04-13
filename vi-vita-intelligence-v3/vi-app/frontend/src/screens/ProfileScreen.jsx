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

    setNotifs(prev => ({
      ...prev,
      [k]: !prev[k]
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
        alignItems: 'center',
        gap: 12,
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
          justifyContent: 'center'
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



  const stats = [

    { label: 'VitaScore', value: vitaScore, color: C.gold },
    { label: 'Lifestyle', value: lifestyleScore, color: C.gold },
    { label: 'Mental', value: mentalScore, color: C.purple },
    { label: 'Perform', value: performanceScore, color: C.gold }

  ]



  return (

    <ScreenWrapper>

      {/* header */}

      <div
        style={{
          background: C.bgMid,
          padding: 20,
          textAlign: 'center'
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



        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: C.gold,
            margin: '10px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            color: C.onGold
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



        {email && (

          <div
            style={{
              color: C.muted
            }}
          >
            {email}
          </div>

        )}

      </div>



      {/* scores */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: 10,
          padding: 20
        }}
      >

        {stats.map(s => (

          <div
            key={s.label}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 10,
              textAlign: 'center'
            }}
          >

            <div
              style={{
                color: s.color,
                fontWeight: 700
              }}
            >
              {s.value}
            </div>



            <div
              style={{
                color: C.muted,
                fontSize: 12
              }}
            >
              {s.label}
            </div>

          </div>

        ))}

      </div>



      {/* logout */}

      <div style={{ padding: 20 }}>

        <button
          onClick={() => setShowLogout(true)}
          style={{
            width: '100%',
            height: 48,
            background: C.orange,
            border: 'none',
            borderRadius: 12,
            color: C.white
          }}
        >
          Logout
        </button>



        <button
          onClick={() => setShowDelete(true)}
          style={{
            width: '100%',
            height: 48,
            marginTop: 10,
            background: C.red,
            border: 'none',
            borderRadius: 12,
            color: C.white
          }}
        >
          Delete Account
        </button>

      </div>



      {showLogout && (

        <button onClick={handleLogout}>
          Confirm logout
        </button>

      )}



      {showDelete && (

        <button onClick={handleDelete}>
          Confirm delete
        </button>

      )}

    </ScreenWrapper>

  )

}
