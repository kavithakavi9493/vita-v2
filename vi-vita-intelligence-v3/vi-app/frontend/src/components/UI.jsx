import { useState, useEffect } from 'react'
import { C, G } from '../constants/colors'

// ─── VI LOGO ─────────────────────────────────────────────
export function VILogo({ size = 60, pulse = false }) {
  return (
    <div
      className={pulse ? 'pulse-gold' : ''}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: G.hero,
        border: `2px solid ${C.goldDeep}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 ${size * 0.35}px rgba(185,129,26,0.35)`,
        flexShrink: 0,
      }}
    >
      <span style={{ color: '#FFD700', fontWeight: 800, fontSize: size * 0.38, letterSpacing: 2 }}>VI</span>
    </div>
  )
}

// ─── GOLD BUTTON ─────────────────────────────────────────
export function GoldBtn({ children, onClick, disabled = false, outline = false, style = {}, height = 56 }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', height, borderRadius: 14, cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled ? C.border : outline ? 'transparent' : G.gold,
        border: outline ? `2px solid ${disabled ? C.subtle : C.gold}` : 'none',
        color: disabled ? C.subtle : outline ? C.gold : C.onGold,
        fontWeight: 700, fontSize: 16,
        boxShadow: (!disabled && !outline) ? `0 4px 18px rgba(185,129,26,0.30)` : 'none',
        transition: 'all .2s', ...style,
      }}
    >
      {children}
    </button>
  )
}

// ─── FOCUS INPUT ─────────────────────────────────────────
export function FocusInput({ value, onChange, placeholder, type = 'text', prefix, style = {}, maxLength }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', background: C.card,
      borderRadius: 12, border: `1.5px solid ${focused ? C.gold : C.border}`,
      height: 54, overflow: 'hidden', transition: 'border-color .2s',
      boxShadow: focused ? `0 0 0 3px ${C.goldBg}` : 'none', ...style,
    }}>
      {prefix && (
        <div style={{
          background: C.goldBg, padding: '0 14px',
          borderRight: `1px solid ${C.goldBorder}`, height: '100%',
          display: 'flex', alignItems: 'center',
          color: C.gold, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
        }}>
          {prefix}
        </div>
      )}
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        maxLength={maxLength}
        style={{ background: 'transparent', border: 'none', color: C.text, fontSize: 15, padding: '0 16px', flex: 1 }}
      />
    </div>
  )
}

// ─── PROGRESS BAR ────────────────────────────────────────
export function ProgressBar({ step, total }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: C.muted, fontSize: 13 }}>Step {step} of {total}</span>
        <span style={{ color: C.gold, fontSize: 13, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 5, background: C.border, borderRadius: 3 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: G.gold, borderRadius: 3, transition: 'width .5s ease' }} />
      </div>
    </div>
  )
}

// ─── OPTION CARD ─────────────────────────────────────────
export function OptionCard({ label, sub, selected, onClick, score }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: selected ? C.goldBg : C.card,
        border: `1.5px solid ${selected ? C.gold : C.border}`,
        borderRadius: 14, padding: '14px 16px', marginBottom: 9,
        cursor: 'pointer', transition: 'all .2s',
        boxShadow: selected ? `0 2px 12px rgba(185,129,26,0.15)` : '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${selected ? C.gold : C.border}`,
        background: selected ? G.gold : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{sub}</div>}
      </div>
      {selected && score && (
        <div style={{
          background: C.goldBg, border: `1px solid ${C.goldBorder}`,
          borderRadius: 20, padding: '2px 10px',
          color: C.gold, fontSize: 12, fontWeight: 700,
        }}>
          {score}
        </div>
      )}
    </div>
  )
}

// ─── SCORE RING ──────────────────────────────────────────
export function ScoreRing({ score, size = 160 }) {
  const [anim, setAnim] = useState(0)
  const r = (size - 16) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (anim / 100) * circ

  useEffect(() => {
    let cur = 0
    const step = score / 60
    const t = setInterval(() => {
      cur = Math.min(cur + step, score)
      setAnim(Math.round(cur))
      if (cur >= score) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [score])

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={10} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={C.gold} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset .05s' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: C.muted, fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>YOUR SCORE</div>
        <div style={{ color: C.text, fontSize: size * 0.22, fontWeight: 800, lineHeight: 1.1 }}>{anim}</div>
        <div style={{ color: C.muted, fontSize: 12 }}>/100</div>
      </div>
    </div>
  )
}

// ─── SMALL RING ──────────────────────────────────────────
export function SmallRing({ score, size = 100 }) {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.gold} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: C.text, fontSize: size * 0.2, fontWeight: 800, lineHeight: 1 }}>{score}</div>
        <div style={{ color: C.muted, fontSize: 9 }}>%</div>
      </div>
    </div>
  )
}

// ─── CARD ────────────────────────────────────────────────
export function Card({ children, style = {}, gold = false }) {
  return (
    <div style={{
      background: gold ? C.goldBg : C.card, borderRadius: 20,
      border: `1px solid ${gold ? C.goldBorder : C.border}`, padding: 20,
      boxShadow: gold ? `0 2px 16px rgba(185,129,26,0.12)` : '0 2px 12px rgba(0,0,0,0.06)', ...style,
    }}>
      {children}
    </div>
  )
}

// ─── SECTION TITLE ───────────────────────────────────────
export function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
      <div style={{ width: 4, height: 20, background: G.gold, borderRadius: 2 }} />
      <span style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>{children}</span>
    </div>
  )
}

// ─── GOLD BADGE ──────────────────────────────────────────
export function GoldBadge({ children, style = {} }) {
  return (
    <div style={{
      background: C.goldBg, border: `1px solid ${C.goldBorder}`,
      borderRadius: 20, padding: '4px 14px', color: C.gold,
      fontSize: 12, fontWeight: 600, display: 'inline-flex',
      alignItems: 'center', gap: 5, ...style,
    }}>
      {children}
    </div>
  )
}

// ─── TOAST ───────────────────────────────────────────────
export function Toast({ msg, type = 'error', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fade-up" style={{
      position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
      zIndex: 999, width: 'min(400px, calc(100vw - 32px))',
      background: type === 'success' ? '#F0FDF4' : '#FEF2F2',
      border: `1px solid ${type === 'success' ? C.green : C.red}`,
      borderRadius: 12, padding: '13px 18px',
      color: type === 'success' ? C.green : C.red,
      fontSize: 14, fontWeight: 500,
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    }}>
      {msg}
    </div>
  )
}

// ─── SPINNER ─────────────────────────────────────────────
export function Spinner({ size = 32, color = C.gold }) {
  return (
    <div className="spin" style={{
      width: size, height: size, borderRadius: '50%',
      border: `3px solid ${C.border}`, borderTopColor: color,
    }} />
  )
}

// ─── DIVIDER ─────────────────────────────────────────────
export function Divider() {
  return <div style={{ height: 1, background: C.border, margin: '16px 0' }} />
}

// ─── TOGGLE SWITCH ───────────────────────────────────────
export function Toggle({ on, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: on ? G.gold : C.border,
        cursor: 'pointer', position: 'relative', transition: 'all .2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: C.white,
        position: 'absolute', top: 3,
        left: on ? 22 : 4, transition: 'left .2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </div>
  )
}

// ─── SCREEN WRAPPER ──────────────────────────────────────
export function ScreenWrapper({ children, scroll = true, bg = C.bgMid, style = {} }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: bg,
      overflowY: scroll ? 'auto' : 'hidden',
      overflowX: 'hidden', ...style,
    }}>
      {children}
    </div>
  )
}

// ─── BOTTOM ACTION BAR ───────────────────────────────────
export function BottomBar({ children }) {
  return (
    <div style={{
      position: 'sticky', bottom: 0, left: 0, right: 0,
      padding: '14px 20px 20px',
      background: 'rgba(255,255,255,0.97)',
      borderTop: `1px solid ${C.border}`,
      backdropFilter: 'blur(12px)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
    }}>
      {children}
    </div>
  )
}
