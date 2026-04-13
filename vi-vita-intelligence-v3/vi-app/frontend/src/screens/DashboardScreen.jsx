import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useApp } from '../context/AppContext'
import { SmallRing, GoldBtn, SectionTitle, Card } from '../components/UI'
import { C, G } from '../constants/colors'

// ─── BOTTOM NAV ──────────────────────────────────────────
function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'plan',     icon: '📦', label: 'My Plan'  },
    { id: 'videos',   icon: '🎬', label: 'Videos'   },
    { id: 'care',     icon: '❤️',  label: 'Care'     },
    { id: 'progress', icon: '📈', label: 'Progress' },
    { id: 'library',  icon: '📚', label: 'Library'  },
  ]
  return (
    <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, display: 'flex', padding: '8px 0 16px', flexShrink: 0, boxShadow: '0 -4px 16px rgba(0,0,0,0.07)' }}>
      {tabs.map(t => (
        <div key={t.id} onClick={() => onChange(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
          <div style={{ fontSize: 19, filter: active === t.id ? 'none' : 'grayscale(1) opacity(.4)' }}>{t.icon}</div>
          <div style={{ fontSize: 9, fontWeight: 600, color: active === t.id ? C.gold : C.subtle }}>{t.label}</div>
          {active === t.id && <div style={{ width: 20, height: 2.5, background: G.gold, borderRadius: 2 }} />}
        </div>
      ))}
    </div>
  )
}

// ─── MY PLAN TAB ─────────────────────────────────────────
function MyPlanTab({ onProfile }) {
  const navigate = useNavigate()
  const { state } = useApp()
  const { userName, vitaScore, planType } = state
  const [tasks, setTasks] = useState([false, false, false, false])
  const TASKS = ['Morning Vitality Shot — 7:00 AM', 'Timing Capsules 2x — After dinner', 'Stress Formula — With breakfast', 'Recovery Powder — Before bed']
  const h = new Date().getHours()
  const greet = h < 12 ? 'Good Morning ☀️' : h < 17 ? 'Good Afternoon 🌤' : 'Good Evening 🌙'

  const VIDEOS = [
    { id: 1, title: 'Ashwagandha: Ancient Secret for Modern Men', expert: 'Dr. Arvind Sharma', dur: '8:45', cat: 'Ayurveda' },
    { id: 2, title: '5-Minute Morning Yoga for Testosterone',     expert: 'Rohit Mehra',       dur: '5:12', cat: 'Yoga'    },
  ]

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', paddingBottom: 20, background: C.bgMid }}>
      {/* Top bar */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div>
          <div style={{ color: C.muted, fontSize: 13 }}>{greet}</div>
          <div style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>{userName || 'User'} 👋</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', fontSize: 22, cursor: 'pointer' }}>
            🔔
            <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: C.red }} />
          </div>
          <div onClick={onProfile} style={{ width: 44, height: 44, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onGold, fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>
            {(userName || 'U')[0]}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* VitaScore hero */}
        <div style={{ background: G.hero, borderRadius: 20, padding: 20, marginBottom: 14, boxShadow: '0 4px 20px rgba(26,14,0,0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 4 }}>Your VitaScore</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                <span style={{ color: '#FFD700', fontSize: 48, fontWeight: 800, lineHeight: 1 }}>{vitaScore}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, marginBottom: 4 }}>/100</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: 20, padding: '2px 10px', color: '#FFD700', fontSize: 11, fontWeight: 600 }}>
                  {vitaScore >= 80 ? 'Excellent' : vitaScore >= 60 ? 'Moderate' : 'Needs Help'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Active: {(planType || 'basic').charAt(0).toUpperCase() + (planType || 'basic').slice(1)}</div>
              </div>
            </div>
            <SmallRing score={vitaScore} size={100} />
          </div>
        </div>

        {/* Results promise */}
        <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 14, padding: '12px 16px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>⏱️</span>
          <div>
            <div style={{ color: C.gold, fontSize: 13, fontWeight: 700 }}>Results Timeline</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>Noticeable changes in <span style={{ color: C.text, fontWeight: 600 }}>15 days</span> with regular use. For complete transformation, <span style={{ color: C.text, fontWeight: 600 }}>3 months</span> recommended.</div>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[{ i: '📅', v: '7', l: 'Days Active' }, { i: '🔥', v: '5', l: 'Day Streak' }, { i: '📦', v: '4', l: 'Products' }, { i: '📍', v: 'Wk2', l: 'Week' }].map(s => (
            <div key={s.l} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 8px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 16 }}>{s.i}</div>
              <div style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{s.v}</div>
              <div style={{ color: C.muted, fontSize: 9 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Today's routine */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>Today's Routine</div>
            <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 20, padding: '2px 10px', color: C.gold, fontSize: 11 }}>
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
          </div>
          {TASKS.map((label, i) => (
            <div key={i} onClick={() => { const t = [...tasks]; t[i] = !t[i]; setTasks(t) }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, marginBottom: 8, background: tasks[i] ? C.goldBg : C.bgMid, border: `1px solid ${tasks[i] ? C.goldBorder : C.border}`, borderRadius: 12, cursor: 'pointer', transition: 'all .2s' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: tasks[i] ? G.gold : 'transparent', border: tasks[i] ? 'none' : `2px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, color: C.onGold, transition: 'all .2s' }}>
                {tasks[i] ? '✓' : ''}
              </div>
              <div style={{ flex: 1, color: tasks[i] ? C.muted : C.text, fontSize: 13, textDecoration: tasks[i] ? 'line-through' : 'none' }}>💊 {label}</div>
              {!tasks[i] && <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 20, padding: '2px 10px', color: C.gold, fontSize: 11 }}>Do Now</div>}
            </div>
          ))}
        </div>

        {/* 4-week journey */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>Your Journey</div>
            <div style={{ color: C.muted, fontSize: 12 }}>Week 2 of 12</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[{ w: 'W1', l: 'Energy', done: true }, { w: 'W2', l: 'Control', cur: true }, { w: 'W3', l: 'Perf' }, { w: 'W4', l: 'Conf' }].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', margin: '0 auto 4px', background: item.done ? G.gold : 'transparent', border: item.cur ? `2px solid ${C.gold}` : item.done ? 'none' : `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.done ? C.onGold : item.cur ? C.gold : C.subtle, fontSize: 13, fontWeight: 700 }}>
                    {item.done ? '✓' : item.w}
                  </div>
                  <div style={{ color: C.muted, fontSize: 10 }}>{item.l}</div>
                </div>
                {i < 3 && <div style={{ height: 2, background: item.done ? G.gold : C.border, width: 20, flexShrink: 0 }} />}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, background: C.goldBg, borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ color: C.gold, fontSize: 12, fontWeight: 600 }}>🕐 Best results in 3 months — stay consistent!</div>
          </div>
        </div>

        {/* Videos preview */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <SectionTitle>Wellness Videos</SectionTitle>
            <span style={{ color: C.gold, fontSize: 13, cursor: 'pointer' }}>See All →</span>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {VIDEOS.map(v => (
              <div key={v.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', flexShrink: 0, width: 200, cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <div style={{ background: G.hero, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: 20, padding: '2px 7px', color: '#FFD700', fontSize: 9 }}>{v.cat}</div>
                  <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.7)', borderRadius: 4, padding: '2px 5px', color: '#fff', fontSize: 9 }}>{v.dur}</div>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: C.onGold }}>▶</div>
                </div>
                <div style={{ padding: '9px 11px' }}>
                  <div style={{ color: C.text, fontSize: 11, fontWeight: 600, lineHeight: 1.4 }}>{v.title}</div>
                  <div style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>{v.expert}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[{ i: '📅', l: 'Book Consult' }, { i: '📝', l: 'Log Today' }, { i: '💬', l: 'Get Support' }].map(a => (
            <div key={a.l} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 8px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{a.i}</div>
              <div style={{ color: C.text, fontSize: 11, fontWeight: 500 }}>{a.l}</div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div style={{ background: C.goldBg, borderLeft: `4px solid ${C.gold}`, borderRadius: '0 14px 14px 0', padding: 16, marginBottom: 24 }}>
          <div style={{ color: C.gold, fontSize: 20, marginBottom: 6 }}>❝</div>
          <div style={{ color: C.text, fontSize: 13, fontStyle: 'italic', marginBottom: 6 }}>Take care of your body. It's the only place you have to live.</div>
          <div style={{ color: C.muted, fontSize: 12 }}>— Jim Rohn</div>
        </div>
      </div>
    </div>
  )
}

// ─── VIDEOS TAB ──────────────────────────────────────────
function VideosTab() {
  const [cat, setCat] = useState('All')
  const [saved, setSaved] = useState([1])
  const CATS = ['All', 'Ayurveda', 'Yoga', 'Mental Health', 'Diet', 'Stories']
  const VIDS = [
    { id: 1, t: 'Ashwagandha: Ancient Secret for Modern Men', e: 'Dr. Arvind Sharma', v: '12.3K', d: '8:45',  c: 'Ayurveda'     },
    { id: 2, t: '5-Minute Morning Yoga for Testosterone',     e: 'Rohit Mehra',       v: '8.7K',  d: '5:12',  c: 'Yoga'         },
    { id: 3, t: 'Managing Stress for Peak Performance',       e: 'Dr. Priya Nair',    v: '6.2K',  d: '12:30', c: 'Mental Health' },
    { id: 4, t: 'Diet Secrets for Male Vitality',             e: 'Dr. Ananya R.',     v: '9.1K',  d: '15:00', c: 'Diet'         },
    { id: 5, t: 'Success Story: From 48 to 82 VitaScore',    e: 'VI Community',      v: '4.5K',  d: '7:20',  c: 'Stories'      },
    { id: 6, t: 'Shilajit: The Mountain Miracle',             e: 'Dr. Arvind Sharma', v: '11.2K', d: '10:15', c: 'Ayurveda'     },
  ]
  const filt = cat === 'All' ? VIDS : VIDS.filter(v => v.c === cat)

  const TESTIMONIALS = [
    { name: 'Rahul M.', age: 38, city: 'Mumbai', score: '54→82', result: 'Energy & confidence completely transformed in 6 weeks', emoji: '🔥', plan: 'Advanced' },
    { name: 'Arjun S.', age: 34, city: 'Bangalore', score: '47→79', result: 'Saw changes from day 15 itself. Best decision I made', emoji: '💪', plan: 'Basic' },
    { name: 'Vikram P.', age: 41, city: 'Delhi', score: '52→88', result: '3 months on Premium plan changed my life completely', emoji: '⭐', plan: 'Premium' },
    { name: 'Kiran D.', age: 36, city: 'Hyderabad', score: '61→91', result: 'My wife noticed the difference before I did!', emoji: '😄', plan: 'Advanced' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: C.bgMid }}>
      <div style={{ background: C.white, padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ color: C.text, fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Wellness Library</div>
        <div style={{ color: C.muted, fontSize: 13 }}>Expert videos for your VI journey</div>
      </div>

      <div style={{ padding: '16px 16px 80px' }}>
        {/* Search */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <span>🔍</span>
          <input placeholder="Search videos..." style={{ background: 'transparent', border: 'none', color: C.text, fontSize: 14, flex: 1 }} />
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 18, paddingBottom: 4 }}>
          {CATS.map(c => (
            <div key={c} onClick={() => setCat(c)} style={{ flexShrink: 0, padding: '6px 14px', background: cat === c ? G.gold : C.white, border: `1px solid ${cat === c ? 'transparent' : C.border}`, borderRadius: 20, color: cat === c ? C.onGold : C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>{c}</div>
          ))}
        </div>

        {/* ── CUSTOMER TESTIMONIALS ── */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Real Men, Real Results</div>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>Watch their transformation stories</div>

          {/* Featured testimonial */}
          <div style={{ background: G.hero, borderRadius: 18, overflow: 'hidden', marginBottom: 12, boxShadow: '0 4px 16px rgba(26,14,0,0.2)' }}>
            <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 20 }}>
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,215,0,0.25)', border: '1px solid rgba(255,215,0,0.5)', borderRadius: 20, padding: '3px 10px', color: '#FFD700', fontSize: 11, fontWeight: 700 }}>⭐ Featured Story</div>
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: '3px 10px', color: '#fff', fontSize: 11 }}>4:32</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: C.onGold, cursor: 'pointer', margin: '0 auto 8px', boxShadow: '0 4px 14px rgba(185,129,26,0.4)' }}>▶</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Tap to watch</div>
              </div>
            </div>
            <div style={{ padding: '14px 16px 16px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onGold, fontWeight: 700, fontSize: 15, flexShrink: 0 }}>R</div>
                <div>
                  <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 700 }}>Rahul M. — Mumbai, 38</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Advanced Plan · VitaScore 54 → 82</div>
                </div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontStyle: 'italic' }}>
                "Energy and confidence completely transformed in just 6 weeks."
              </div>
            </div>
          </div>

          {/* Testimonial scroll */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {TESTIMONIALS.slice(1).map((t, i) => (
              <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', flexShrink: 0, width: 200, cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <div style={{ background: G.hero, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '2px 5px', color: '#fff', fontSize: 9 }}>3:00</div>
                  <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: 20, padding: '2px 7px', color: '#FFD700', fontSize: 9 }}>{t.plan}</div>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: C.onGold }}>▶</div>
                </div>
                <div style={{ padding: '10px 11px' }}>
                  <div style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>{t.name} · {t.city}</div>
                  <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 8, padding: '3px 8px', color: C.gold, fontSize: 10, fontWeight: 700, marginTop: 5, display: 'inline-block' }}>Score {t.score}</div>
                  <div style={{ color: C.muted, fontSize: 10, marginTop: 5, fontStyle: 'italic', lineHeight: 1.4 }}>"{t.result}"</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review stars */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: C.text, fontSize: 28, fontWeight: 800 }}>4.9</div>
            <div style={{ color: C.gold, fontSize: 14 }}>★★★★★</div>
            <div style={{ color: C.muted, fontSize: 10 }}>10,000+ reviews</div>
          </div>
          <div style={{ flex: 1 }}>
            {[['5★', 82], ['4★', 13], ['3★', 3], ['2★', 1], ['1★', 1]].map(([lbl, pct]) => (
              <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ color: C.muted, fontSize: 10, width: 18 }}>{lbl}</span>
                <div style={{ flex: 1, height: 5, background: C.border, borderRadius: 3 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: G.gold, borderRadius: 3 }} />
                </div>
                <span style={{ color: C.muted, fontSize: 10, width: 24, textAlign: 'right' }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured video */}
        <div style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Expert Videos</div>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <div style={{ background: G.hero, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: 20, padding: '3px 10px', color: '#FFD700', fontSize: 11, fontWeight: 600 }}>⭐ Featured This Week</div>
            <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '3px 8px', color: '#fff', fontSize: 11 }}>8:45</div>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: C.onGold, cursor: 'pointer' }}>▶</div>
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Ashwagandha: Ancient Secret for Modern Men</div>
            <div style={{ color: C.muted, fontSize: 12 }}>Dr. Arvind Sharma · 12.3K views</div>
          </div>
        </div>

        {/* Video grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filt.map(v => (
            <div key={v.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ background: G.hero, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 5, left: 5, background: 'rgba(255,215,0,0.2)', borderRadius: 20, padding: '2px 6px', color: '#FFD700', fontSize: 9 }}>{v.c}</div>
                <div style={{ position: 'absolute', bottom: 5, right: 5, background: 'rgba(0,0,0,0.7)', borderRadius: 4, padding: '2px 5px', color: '#fff', fontSize: 9 }}>{v.d}</div>
                <div onClick={e => { e.stopPropagation(); setSaved(s => s.includes(v.id) ? s.filter(x => x !== v.id) : [...s, v.id]) }} style={{ position: 'absolute', top: 5, right: 5, cursor: 'pointer', fontSize: 15 }}>
                  {saved.includes(v.id) ? '❤️' : '🤍'}
                </div>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: C.onGold }}>▶</div>
              </div>
              <div style={{ padding: '9px 11px' }}>
                <div style={{ color: C.text, fontSize: 11, fontWeight: 600, lineHeight: 1.4, marginBottom: 4 }}>{v.t}</div>
                <div style={{ color: C.muted, fontSize: 10 }}>{v.e}</div>
                <div style={{ color: C.subtle, fontSize: 10 }}>{v.v} views</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CARE TAB ────────────────────────────────────────────
function CareTab() {
  const { state } = useApp()
  const { planType, vitaScore } = state
  const EXPERTS = [
    { n: 'Dr. Arvind Sharma', t: 'Ayurvedic Specialist', i: 'A', r: '4.9' },
    { n: 'Dr. Priya Nair',    t: 'Sexual Health Expert', i: 'P', r: '4.9' },
    { n: 'Rohit Mehra',       t: 'VI Wellness Coach',    i: 'R', r: '4.8' },
    { n: 'Dr. Ananya R.',     t: 'Nutritionist',         i: 'AN', r: '4.9' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: C.bgMid }}>
      <div style={{ background: C.white, padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>Your Care Hub</div>
            <div style={{ color: C.muted, fontSize: 13 }}>Expert support for your VI journey</div>
          </div>
          <div style={{ background: '#DCFCE7', border: `1px solid ${C.green}`, borderRadius: 20, padding: '4px 12px', color: C.green, fontSize: 11, fontWeight: 600 }}>🟢 Support Active</div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 80px' }}>
        {/* Plan banner */}
        <div style={{ background: planType === 'basic' ? C.white : C.goldBg, border: `1px solid ${planType === 'basic' ? C.border : C.goldBorder}`, borderRadius: 16, padding: 16, marginBottom: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {planType === 'basic'
            ? <><div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Basic Plan Support</div><div style={{ color: C.muted, fontSize: 13, marginBottom: 10 }}>Upgrade to unlock more expert consultations</div><GoldBtn style={{ height: 40, fontSize: 14 }}>Upgrade Now →</GoldBtn></>
            : planType === 'advanced'
            ? <><div style={{ color: C.gold, fontSize: 15, fontWeight: 700 }}>✅ Advanced Care Unlocked</div><div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>4 expert consultations/week + Body checkup + Diet plans</div></>
            : <><div style={{ color: C.gold, fontSize: 15, fontWeight: 700 }}>👑 Premium Care Active</div><div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Weekly personal expert care + Advanced formulas</div></>}
        </div>

        {/* Care cards */}
        {[
          { icon: '📹', title: 'Book a Consultation', desc: '1-on-1 video call with certified Ayurvedic wellness expert.', pills: ['⏱ 30 min', '📹 Video Call', '🌐 Hindi/English'], btn: 'Schedule Now →', bg: G.gold, tc: C.onGold },
          { icon: '👥', title: 'Join Live Sessions', desc: 'Weekly group sessions every Sunday. Invite included in all plans.', pills: ['👥 Group', '📅 Every Sunday', '⏱ 60 min'], btn: 'Join Now →', bg: G.navy, tc: '#fff' },
          { icon: '💬', title: 'WhatsApp Support', desc: 'Chat directly with VI team. 9AM–9PM | Instant reply.', pills: ['⚡ Instant Reply', '⏰ 9AM–9PM'], btn: 'Chat on WhatsApp →', bg: '#25D366', tc: '#fff' },
        ].map((c, i) => (
          <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: C.goldBg, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
              <div><div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{c.title}</div><div style={{ color: C.muted, fontSize: 13 }}>{c.desc}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {c.pills.map(p => <div key={p} style={{ background: C.bgMid, border: `1px solid ${C.border}`, borderRadius: 20, padding: '3px 10px', color: C.muted, fontSize: 11 }}>{p}</div>)}
            </div>
            <button onClick={() => { if (i === 2) window.open(`https://wa.me/91XXXXXXXXXX?text=Hi, I need support. My VitaScore is ${vitaScore}.`, '_blank') }} style={{ width: '100%', height: 44, borderRadius: 10, background: c.bg, border: 'none', color: c.tc, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>{c.btn}</button>
          </div>
        ))}

        {/* Experts */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Our Expert Team</div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {EXPERTS.map(e => (
              <div key={e.n} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, flexShrink: 0, width: 140, textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onGold, fontWeight: 700, margin: '0 auto 8px', fontSize: 16 }}>{e.i}</div>
                <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{e.n}</div>
                <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>{e.t}</div>
                <div style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>{e.r}★</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#DCFCE7', border: `1px solid ${C.green}`, borderRadius: 12, padding: '13px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: C.text, fontSize: 14 }}>💬 Need urgent help?</div>
          <button onClick={() => window.open('https://wa.me/91XXXXXXXXXX', '_blank')} style={{ background: '#25D366', border: 'none', borderRadius: 8, padding: '6px 14px', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Chat Now</button>
        </div>
      </div>
    </div>
  )
}

// ─── PROGRESS TAB ────────────────────────────────────────
function ProgressTab() {
  const { state } = useApp()
  const { userId } = state
  const [logged, setLogged] = useState(false)
  const [a, setA] = useState({ q1: null, energy: 6, perf: null, notes: '' })
  const [streak, setStreak] = useState(5)
  const [period, setPeriod] = useState('7D')
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const STATUS = [true, true, true, true, true, false, false]
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const ENERGY_DATA = [5, 7, 6, 8, 7, 6, 8]
  const MILESTONES = [
    { i: '🎯', l: 'First Log', u: true }, { i: '🔥', l: '3-Day Streak', u: true },
    { i: '⚡', l: 'Week Warrior', u: false }, { i: '💪', l: '2-Week Strong', u: false },
    { i: '🏆', l: 'Month Master', u: false }, { i: '⭐', l: 'Perfect Week', u: false },
  ]

  const saveLog = async () => {
    if (!a.q1 || !a.perf) return
    const today_str = new Date().toISOString().split('T')[0]
    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId, 'progress', today_str), {
          date: today_str, tookCapsules: a.q1 === 'yes',
          energyLevel: a.energy, performanceRating: a.perf,
          notes: a.notes, loggedAt: serverTimestamp(),
        })
      } catch (err) { console.error(err) }
    }
    setLogged(true)
    setStreak(s => s + 1)
  }

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: C.bgMid }}>
      <div style={{ background: C.white, padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>My Progress</div>
          <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 20, padding: '4px 12px', color: C.gold, fontSize: 13, fontWeight: 600 }}>{streak} Day Streak 🔥</div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 80px' }}>
        {/* Stats hero */}
        <div style={{ background: G.hero, borderRadius: 20, padding: 20, marginBottom: 14, boxShadow: '0 4px 20px rgba(26,14,0,0.2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            {[{ v: streak, u: 'DAYS', l: 'Streak' }, { v: 12, u: 'LOGS', l: 'Total' }, { v: 7, u: 'DAYS', l: 'Best' }, { v: '6.8', u: 'AVG', l: 'Energy' }].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ color: '#FFD700', fontSize: 18, fontWeight: 700 }}>{s.v}</div>
                <div style={{ color: 'rgba(255,215,0,0.6)', fontSize: 9, letterSpacing: 1 }}>{s.u}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Results promise */}
        <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 14, padding: '12px 16px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18 }}>⏱️</span>
          <div>
            <div style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>Stay Consistent for Results</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Use regularly for <b style={{color:C.text}}>15 days</b> to see initial changes. <b style={{color:C.text}}>3 months</b> for complete transformation.</div>
          </div>
        </div>

        {/* Weekly dots */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>This Week</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {DAYS.map((d, i) => (
              <div key={d} style={{ textAlign: 'center' }}>
                <div style={{ color: C.muted, fontSize: 10, marginBottom: 6 }}>{d}</div>
                <div style={{ width: 32, height: 32, borderRadius: '50%', margin: '0 auto', background: STATUS[i] ? G.gold : (i === today ? 'transparent' : C.bgMid), border: i === today && !STATUS[i] ? `2px solid ${C.gold}` : STATUS[i] ? 'none' : `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                  {STATUS[i] ? <span style={{ fontSize: 11, color: C.onGold }}>✓</span> : i === today ? <span style={{ fontSize: 10, color: C.gold }}>•</span> : <span style={{ fontSize: 10, color: C.border }}>✗</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Log card */}
        {!logged ? (
          <div style={{ background: C.white, border: `1.5px solid ${C.gold}`, borderRadius: 20, padding: 20, marginBottom: 14, boxShadow: '0 2px 16px rgba(185,129,26,0.12)' }}>
            <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 20, padding: '4px 14px', color: C.gold, fontSize: 12, fontWeight: 600, display: 'inline-block', marginBottom: 10 }}>🟡 Log Today's Progress</div>
            <div style={{ color: C.text, fontSize: 17, fontWeight: 700, marginBottom: 4 }}>How are you feeling today?</div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 18 }}>Take 30 seconds — it matters.</div>

            {/* Q1 */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>💊 Did you take your supplements?</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[{ v: 'yes', l: '✅ Yes' }, { v: 'no', l: '❌ No' }].map(o => (
                  <div key={o.v} onClick={() => setA({ ...a, q1: o.v })} style={{ padding: 11, textAlign: 'center', borderRadius: 12, border: `2px solid ${a.q1 === o.v ? (o.v === 'yes' ? C.gold : C.red) : C.border}`, background: a.q1 === o.v ? (o.v === 'yes' ? C.goldBg : '#FEF2F2') : C.bgMid, cursor: 'pointer', color: C.text, fontSize: 14, fontWeight: 600, transition: 'all .2s' }}>{o.l}</div>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>⚡ Energy Level Today</div>
              <input type="range" min={1} max={10} value={a.energy} onChange={e => setA({ ...a, energy: parseInt(e.target.value) })} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: C.muted, fontSize: 12 }}>Low</span>
                <span style={{ color: C.gold, fontSize: 16, fontWeight: 700 }}>{a.energy}/10</span>
                <span style={{ color: C.muted, fontSize: 12 }}>High</span>
              </div>
            </div>

            {/* Q3 */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>⚡ Performance Rating</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5 }}>
                {[{ v: 1, e: '😞' }, { v: 2, e: '😐' }, { v: 3, e: '🙂' }, { v: 4, e: '😊' }, { v: 5, e: '🔥' }].map(r => (
                  <div key={r.v} onClick={() => setA({ ...a, perf: r.v })} style={{ padding: '8px 4px', textAlign: 'center', borderRadius: 10, border: `2px solid ${a.perf === r.v ? C.gold : C.border}`, background: a.perf === r.v ? C.goldBg : C.bgMid, cursor: 'pointer', fontSize: 20, transition: 'all .2s' }}>{r.e}</div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>📝 Notes (optional)</div>
              <textarea value={a.notes} onChange={e => setA({ ...a, notes: e.target.value })} placeholder="How did you feel today..." style={{ width: '100%', height: 70, background: C.bgMid, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontSize: 13, padding: 10, resize: 'none' }} />
            </div>
            <GoldBtn onClick={saveLog} disabled={!a.q1 || !a.perf}>Save Today's Log ✅</GoldBtn>
          </div>
        ) : (
          <div style={{ background: C.white, border: `1px solid ${C.goldBorder}`, borderRadius: 20, padding: 24, marginBottom: 14, textAlign: 'center', boxShadow: '0 2px 16px rgba(185,129,26,0.1)' }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: C.goldBg, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 14px' }}>✅</div>
            <div style={{ color: C.text, fontSize: 19, fontWeight: 700, marginBottom: 6 }}>Today Logged! 🎉</div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>Supplements: {a.q1 === 'yes' ? '✅ Taken' : '❌ Skipped'} · Energy: {a.energy}/10 · {['😞', '😐', '🙂', '😊', '🔥'][a.perf - 1]}</div>
            <GoldBtn outline style={{ height: 42, fontSize: 13 }} onClick={() => setLogged(false)}>Edit Today's Log</GoldBtn>
          </div>
        )}

        {/* Energy chart */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, marginBottom: 14, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>Energy Trend</div>
            <div style={{ display: 'flex', gap: 5 }}>
              {['7D', '14D', '30D'].map(p => <div key={p} onClick={() => setPeriod(p)} style={{ padding: '3px 10px', borderRadius: 20, background: period === p ? G.gold : C.border, color: period === p ? C.onGold : C.muted, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{p}</div>)}
            </div>
          </div>
          <div style={{ height: 75, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
            {ENERGY_DATA.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', background: G.gold, borderRadius: '4px 4px 0 0', height: `${(v / 10) * 75}px`, minHeight: 4 }} />
                <div style={{ color: C.muted, fontSize: 9 }}>{DAYS[i]?.slice(0, 1)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Milestones</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {MILESTONES.map(m => (
              <div key={m.l} style={{ background: m.u ? C.goldBg : C.white, border: `1px solid ${m.u ? C.goldBorder : C.border}`, borderRadius: 14, padding: '12px 10px', flexShrink: 0, width: 100, textAlign: 'center', opacity: m.u ? 1 : 0.5, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 26, marginBottom: 5 }}>{m.u ? m.i : '🔒'}</div>
                <div style={{ color: m.u ? C.text : C.muted, fontSize: 10, fontWeight: 600 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── LIBRARY TAB ─────────────────────────────────────────
function LibraryTab() {
  const [activeSection, setActiveSection] = useState('all')

  const ARTICLES = [
    { cat: 'Body Science', icon: '🧬', title: 'How Testosterone Really Works', read: '5 min', views: '8.2K' },
    { cat: 'Ancient Formulas', icon: '🌿', title: 'Why Shilajit is Called Destroyer of Weakness', read: '7 min', views: '12.1K' },
    { cat: 'VI Science', icon: '🔬', title: 'How We Develop Our Ancient Formulas', read: '8 min', views: '6.4K' },
    { cat: 'Wellness', icon: '💤', title: 'The Sleep-Testosterone Connection', read: '4 min', views: '9.8K' },
    { cat: 'Body Science', icon: '🩸', title: 'Blood Flow and Male Performance: The Complete Guide', read: '9 min', views: '7.3K' },
    { cat: 'Ancient Formulas', icon: '🌱', title: 'Ashwagandha KSM-66: Science Behind the Ancient Herb', read: '6 min', views: '11.5K' },
    { cat: 'VI Science', icon: '⚗️', title: 'Modern Science Meets Siddha Wisdom', read: '10 min', views: '5.2K' },
    { cat: 'Wellness', icon: '🧠', title: 'Cortisol: The Silent Destroyer of Male Vitality', read: '6 min', views: '8.7K' },
  ]

  const CATS = ['all', 'Body Science', 'Ancient Formulas', 'VI Science', 'Wellness']
  const filtered = activeSection === 'all' ? ARTICLES : ARTICLES.filter(a => a.cat === activeSection)

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: C.bgMid }}>
      {/* Header */}
      <div style={{ background: C.white, padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ color: C.text, fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Knowledge Library</div>
        <div style={{ color: C.muted, fontSize: 13 }}>100+ articles on health, wellness & ancient science</div>
      </div>

      <div style={{ padding: '16px 16px 80px' }}>

        {/* ── FOUNDER STORY ─────────────────────────────── */}
        <div style={{ background: G.hero, borderRadius: 20, padding: 22, marginBottom: 18, boxShadow: '0 6px 24px rgba(26,14,0,0.25)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: G.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, boxShadow: '0 4px 14px rgba(185,129,26,0.4)' }}>🧘</div>
            <div>
              <div style={{ color: 'rgba(255,215,0,0.7)', fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 2 }}>FOUNDER'S STORY</div>
              <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 800 }}>Chetan Patil</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>Himalayan Siddha Scholar · Founder, VI Intelligence</div>
            </div>
          </div>

          <div style={{ color: 'rgba(255,215,0,0.85)', fontSize: 22, marginBottom: 8 }}>❝</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
            At 22, I left everything — a secure engineering career, city life, comfort — and walked into the Himalayas. Not for tourism. For truth.
          </div>

          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, marginBottom: 14 }}>
            <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🏔 The Himalayan Years</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.7 }}>
              I spent over <b style={{color:'#FFD700'}}>8 years above 3,500 metres</b>, studying under Siddha masters who possessed centuries-old knowledge passed through unbroken lineages. I learned ancient Sanskrit health texts. I practiced rigorous sadhana. I developed Siddhis — abilities that modern science is only beginning to understand.
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, marginBottom: 14 }}>
            <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🔬 The Discovery</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.7 }}>
              In the mountains, I witnessed firsthand how ancient rasayana formulas could reverse what modern medicine had given up on. I saw men — well into their 50s and 60s — with the vitality of 25-year-olds. Their secret was not drugs. It was <b style={{color:'#FFD700'}}>Ojas</b> — the supreme life force the ancient masters spoke of.
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, marginBottom: 14 }}>
            <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>💡 The Modern Crisis</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.7 }}>
              When I returned, I saw the biggest silent crisis facing men today: <b style={{color:'#FFD700'}}>depleted sexual wellness and vitality</b>. Stress, poor sleep, processed food, environmental toxins — they are draining Ojas at a scale the ancients never imagined. Most men suffer in silence, not knowing a solution exists.
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, marginBottom: 16 }}>
            <div style={{ color: '#FFD700', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🌟 The Mission</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.7 }}>
              I spent 3 more years working with leading biochemists and Ayurvedic physicians, translating ancient formulas into <b style={{color:'#FFD700'}}>100+ clinically-validated products</b>. VI Intelligence is the culmination of my life's work — ancient Siddha wisdom, made accessible to every modern man who refuses to accept decline.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['8+ Years in Himalayas', '100+ Formulas', 'Siddha Scholar', '10,000+ Lives Changed'].map(t => (
              <div key={t} style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.35)', borderRadius: 20, padding: '4px 10px', color: '#FFD700', fontSize: 11, fontWeight: 600 }}>{t}</div>
            ))}
          </div>
        </div>

        {/* Why VI section */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18, marginBottom: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Why VI Intelligence is Different</div>
          {[
            { i: '🏔', t: 'Himalayan Sourcing', d: 'Raw ingredients sourced directly from high-altitude regions above 3,000m' },
            { i: '🔬', t: 'Ancient + Modern', d: 'Every formula backed by Siddha traditions AND modern clinical research' },
            { i: '🧪', t: 'No Compromises', d: 'Zero steroids, zero chemicals, zero shortcuts — ever' },
            { i: '📊', t: 'AI-Personalised', d: 'Your quiz score determines your exact formula combination' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 3 ? 14 : 0 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: C.goldBg, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.i}</div>
              <div>
                <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{item.t}</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Article stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
          {[{ v: '100+', l: 'Articles' }, { v: '20+', l: 'Experts' }, { v: '50K+', l: 'Readers' }].map(s => (
            <div key={s.l} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ color: C.gold, fontSize: 20, fontWeight: 800 }}>{s.v}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Browse Articles</div>
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
          {CATS.map(c => (
            <div key={c} onClick={() => setActiveSection(c)} style={{ flexShrink: 0, padding: '6px 14px', background: activeSection === c ? G.gold : C.white, border: `1px solid ${activeSection === c ? 'transparent' : C.border}`, borderRadius: 20, color: activeSection === c ? C.onGold : C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textTransform: c === 'all' ? 'capitalize' : 'none' }}>{c === 'all' ? 'All Articles' : c}</div>
          ))}
        </div>

        {/* Articles list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((art, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', transition: 'all .2s' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: C.goldBg, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{art.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 20, padding: '1px 8px', color: C.gold, fontSize: 10, fontWeight: 600, display: 'inline-block', marginBottom: 4 }}>{art.cat}</div>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{art.title}</div>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>📖 {art.read} read · 👁 {art.views} views</div>
              </div>
              <div style={{ color: C.gold, fontSize: 18 }}>›</div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div style={{ textAlign: 'center', marginTop: 16, padding: 14, background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ color: C.gold, fontSize: 14, fontWeight: 600 }}>Load More Articles →</div>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>100+ articles available</div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN DASHBOARD ──────────────────────────────────────
export default function DashboardScreen() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('plan')

  return (
    <div style={{ width: '100%', height: '100%', background: C.bgMid, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {tab === 'plan'     && <MyPlanTab  onProfile={() => navigate('/profile')} />}
        {tab === 'videos'   && <VideosTab  />}
        {tab === 'care'     && <CareTab    />}
        {tab === 'progress' && <ProgressTab />}
        {tab === 'library'  && <LibraryTab  />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
