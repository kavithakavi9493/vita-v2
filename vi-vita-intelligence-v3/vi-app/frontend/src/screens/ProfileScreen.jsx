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
		        {/* Hero header */}
		        <div style={{ background: C.bgMid, padding: '20px 20px 28px' }}>
		          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
		            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: C.text, fontSize: 22, cursor: 'pointer' }}>←</button>
		            <div style={{ color: C.text, fontSize: 18, fontWeight: 700 }}>My Profile</div>
		            <div style={{ border: `1px solid ${C.gold}`, borderRadius: 20, padding: '4px 14px', color: C.gold, fontSize: 12, cursor: 'pointer' }}>Edit</div>
		          </div>
		          <div style={{ textAlign: 'center' }}>
		            <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.gold, border: `2px solid ${C.goldDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 32, fontWeight: 700, color: C.onGold, boxShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
		              {(userName || 'U')[0]}
		            </div>
		            <div style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>{userName || 'User'}</div>
		            <div style={{ color: C.muted, fontSize: 14 }}>📱 +91 {phone}</div>
		            {email && <div style={{ color: C.muted, fontSize: 14 }}>✉ {email}</div>}
		            <div style={{ background: C.goldBg, border: `1px solid ${C.gold}`, borderRadius: 20, padding: '4px 14px', color: C.gold, fontSize: 12, display: 'inline-block', marginTop: 8 }}>
		              {(planType || 'Free').charAt(0).toUpperCase() + (planType || 'free').slice(1)} Plan · Member since Apr 2025
		            </div>
		          </div>
		        </div>

		        {/* Score strip */}
		        <div style={{ margin: '14px 20px', background: C.card, border: `1px solid ${C.gold}`, borderRadius: 12, padding: '13px 16px' }}>
		          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
		            {[{ v: vitaScore, l: 'VitaScore', c: C.text }, { v: lifestyleScore, l: 'Lifestyle', c: C.gold }, { v: mentalScore, l: 'Mental', c: C.purple }, { v: performanceScore, l: 'Perform', c: C.gold }].map((s, i) => (
				                <div key={s.l} style={{ textAlign: 'center', borderLeft: i > 0 ? `1px solid ${C.border}` : 'none' }}>
				                  <div style={{ color: s.c, fontSize: 17, fontWeight: 700 }}>{s.v}</div>
				                  <div style={{ color: C.muted, fontSize: 10 }}>{s.l}</div>
				                </div>
				              ))}
		          </div>
		        </div>

		        <div style={{ padding: '0 20px 60px' }}>
		          {/* Personal info */}
		          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '4px 16px', marginBottom: 14 }}>
		            <div style={{ color: C.gold, fontSize: 12, fontWeight: 700, padding: '12px 0 8px', letterSpacing: 1 }}>PERSONAL INFORMATION</div>
		            <Row icon="👤" label="Full Name" value={userName} chevron={false} />
		            <Row icon="📱" label="Phone"     value="✅ Verified" chevron={false} />
		            <Row icon="✉️" label="Email"     value={email || 'Not added'} chevron={false} />
		            <Row icon="🎂" label="Age Group" value={ageGroup} chevron={false} />
		          </div>

		          {/* My plan */}
		          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '4px 16px', marginBottom: 14 }}>
		            <div style={{ color: C.gold, fontSize: 12, fontWeight: 700, padding: '12px 0 8px', letterSpacing: 1 }}>MY VI PLAN</div>
		            <Row icon="⭐" label="Active Plan" value={(planType || 'None').charAt(0).toUpperCase() + (planType || 'none').slice(1)} />
		            <Row icon="⚡" label="VitaScore"   value={`${vitaScore}/100`} onPress={() => navigate('/result')} />
		            <Row icon="📅" label="Plan Started" value="Apr 2025" chevron={false} />
		            {planType !== 'premium' && <Row icon="🔼" label="Upgrade Plan" onPress={() => navigate('/plan')} />}
		          </div>

		          {/* Notifications */}
		          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '4px 16px', marginBottom: 14 }}>
		            <div style={{ color: C.gold, fontSize: 12, fontWeight: 700, padding: '12px 0 8px', letterSpacing: 1 }}>NOTIFICATIONS</div>
		            {[
				                { k: 'daily',   l: 'Daily Reminders',   s: 'Morning supplement reminders' },
				                { k: 'session', l: 'Session Alerts',     s: '1hr before live sessions'     },
				                { k: 'prog',    l: 'Progress Nudges',    s: 'Weekly progress updates'       },
				                { k: 'offers',  l: 'Offers & Updates',   s: 'Promotions and new features'   },
				              ].map(n => (
						                  <div key={n.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
						                    <div>
						                      <div style={{ color: C.text, fontSize: 14 }}>{n.l}</div>
						                      <div style={{ color: C.muted, fontSize: 11 }}>{n.s}</div>
						                    </div>
						                    <Toggle on={notifs[n.k]} onToggle={() => toggleNotif(n.k)} />
						                  </div>
						                ))}
		          </div>

		          {/* Support */}
		          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '4px 16px', marginBottom: 14 }}>
		            <div style={{ color: C.gold, fontSize: 12, fontWeight: 700, padding: '12px 0 8px', letterSpacing: 1 }}>SUPPORT</div>
		            <Row icon="❓" label="Help Center"       onPress={() => window.open('https://vitaintelligence.app/help', '_blank')} />
		            <Row icon="💬" label="Contact Support"   onPress={() => window.open('https://wa.me/91XXXXXXXXXX', '_blank')} />
		            <Row icon="★"  label="Rate VI App"       onPress={() => window.open('https://play.google.com/store', '_blank')} />
		            <Row icon="🔗" label="Share VI"          onPress={() => navigator.share?.({ title: 'VI — Vita Intelligence', url: 'https://vitaintelligence.app' })} />
		          </div>

		          {/* Legal */}
		          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '4px 16px', marginBottom: 14 }}>
		            <div style={{ color: C.gold, fontSize: 12, fontWeight: 700, padding: '12px 0 8px', letterSpacing: 1 }}>LEGAL</div>
		            <Row icon="📄" label="Privacy Policy"  onPress={() => window.open('#', '_blank')} />
		            <Row icon="📋" label="Terms of Service" onPress={() => window.open('#', '_blank')} />
		            <Row icon="↩"  label="Refund Policy"   onPress={() => window.open('#', '_blank')} />
		          </div>

		          {/* Account */}
		          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '4px 16px', marginBottom: 32 }}>
		            <div style={{ color: C.gold, fontSize: 12, fontWeight: 700, padding: '12px 0 8px', letterSpacing: 1 }}>ACCOUNT</div>
		            <Row icon="🗑️" label="Delete Account" danger onPress={() => setShowDelete(true)} />
		            <Row icon="🚪" label="Log Out" onPress={() => setShowLogout(true)} chevron={false} />
		          </div>

		          {/* Branding */}
		          <div style={{ textAlign: 'center' }}>
		            <div style={{ color: C.gold, fontSize: 32, opacity: 0.3, marginBottom: 6 }}>VI</div>
		            <div style={{ color: C.muted, fontSize: 12 }}>VI — Vita Intelligence</div>
		            <div style={{ color: C.subtle, fontSize: 11, marginTop: 4 }}>Made with ❤️ for Men's Health</div>
		            <div style={{ color: C.subtle, fontSize: 10, marginTop: 4 }}>v1.0.0</div>
		          </div>
		        </div>

		        {/* Logout dialog */}
		        {showLogout && (
				        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}>
				          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, width: '100%', maxWidth: 340, textAlign: 'center' }}>
				            <div style={{ fontSize: 36, marginBottom: 12 }}>🚪</div>
				            <div style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Log Out?</div>
				            <div style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>You'll need to sign in again to access your VI data.</div>
				            <button onClick={handleLogout} style={{ width: '100%', height: 50, borderRadius: 12, background: C.orange, border: 'none', color: C.white, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>Yes, Log Out</button>
				            <button onClick={() => setShowLogout(false)} style={{ width: '100%', height: 50, borderRadius: 12, background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
				          </div>
				        </div>
				      )}

		        {/* Delete dialog */}
		        {showDelete && (
				        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}>
				          <div style={{ background: C.card, border: `1px solid ${C.red}`, borderRadius: 20, padding: 28, width: '100%', maxWidth: 340, textAlign: 'center' }}>
				            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
				            <div style={{ color: C.red, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Delete Account?</div>
				            <div style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>This will permanently delete all your VI data. This cannot be undone.</div>
				            <button onClick={handleDelete} style={{ width: '100%', height: 50, borderRadius: 12, background: C.red, border: 'none', color: C.white, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>Yes, Delete Everything</button>
				            <button onClick={() => setShowDelete(false)} style={{ width: '100%', height: 50, borderRadius: 12, background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
				          </div>
				        </div>
				      )}
		      </ScreenWrapper>
		    )
}

