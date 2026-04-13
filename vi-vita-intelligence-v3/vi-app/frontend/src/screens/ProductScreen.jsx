import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GoldBtn, ScreenWrapper, BottomBar } from '../components/UI'
import { C, G } from '../constants/colors'

const ALL_PRODUCTS = [
  {
    id: 1, icon: '💊',
    brand: 'Vajra Veerya', hindi: 'वज्र वीर्य',
    cat: 'Testosterone Boost',
    mrp: 1199, price: 849,
    benefits: ['Testosterone Rise', 'Energy Surge', 'Muscle Strength'],
    ingredients: 'Ashwagandha, Shilajit, Safed Musli, Gokshura, Kapikacchu',
    usage: '2 capsules daily after breakfast',
    rating: 4.9, reviews: 3241,
    show: (s, ag) => s.performanceScore < 15 || s.libidoLevel === 'Low' || ag === '36-45' || ag === '45+',
  },
  {
    id: 2, icon: '⏱️',
    brand: 'Sthambhan Shakti', hindi: 'स्थम्भन शक्ति',
    cat: 'Timing Control',
    mrp: 999, price: 699,
    benefits: ['Better Control', 'Longer Duration', 'Confidence'],
    ingredients: 'Jaiphal, Akarkara, Vidari Kanda, Ashwagandha, Shatavari',
    usage: '2 capsules 1 hour before activity',
    rating: 4.8, reviews: 2847,
    show: (s) => s.timingControl === 'Sometimes' || s.timingControl === 'Often' || s.performanceScore < 15,
  },
  {
    id: 3, icon: '🔥',
    brand: 'Dridha Stambh', hindi: 'दृढ स्तम्भ',
    cat: 'Erection Support',
    mrp: 1099, price: 779,
    benefits: ['Stronger Erection', 'Blood Flow', 'Vascular Health'],
    ingredients: 'Vidarikanda, Kaunch Beej, Gokshura, Swarna Bhasma, Shilajit',
    usage: '2 capsules after dinner with warm milk',
    rating: 4.8, reviews: 2103,
    show: (s) => s.erectionQuality === 'Moderate' || s.erectionQuality === 'Weak' || s.performanceScore < 15,
  },
  {
    id: 4, icon: '🧠',
    brand: 'Manas Veerya', hindi: 'मनस् वीर्य',
    cat: 'Stress & Calm',
    mrp: 899, price: 649,
    benefits: ['Calm Mind', 'Cortisol Control', 'Focus & Sleep'],
    ingredients: 'Brahmi, Ashwagandha, Jatamansi, L-Theanine, Magnesium',
    usage: '1 capsule morning + 1 at night',
    rating: 4.8, reviews: 1654,
    show: (s) => s.mentalScore < 15 || s.stressLevel === 'High' || s.anxietyLevel === 'Often',
  },
  {
    id: 5, icon: '⚡',
    brand: 'Kaam Agni Ras', hindi: 'काम अग्नि रस',
    cat: 'Pre-Intimacy Shots',
    mrp: 1499, price: 999,
    benefits: ['Instant Ignition', 'Fast Absorb', 'Passion Boost'],
    ingredients: 'Saffron, Shilajit Extract, Zinc, Ginseng, Vitamin B12, Honey Base',
    usage: '1 shot 30 minutes before activity',
    rating: 4.9, reviews: 3102,
    show: (s) => s.libidoLevel === 'Low' || s.libidoLevel === 'Moderate' || s.performanceScore < 15,
  },
  {
    id: 6, icon: '🌿',
    brand: 'Rasayana Shakti', hindi: 'रसायन शक्ति',
    cat: 'Night Recovery',
    mrp: 1099, price: 799,
    benefits: ['Deep Sleep', 'Hormone Repair', 'Morning Energy'],
    ingredients: 'Magnesium Glycinate, Tart Cherry, L-Glycine, Zinc, Ashwagandha, Melatonin 0.5mg',
    usage: '1 scoop in warm water before bed',
    rating: 4.7, reviews: 1287,
    show: (s) => s.lifestyleScore < 15 || s.fatigueLevel === 'Frequently',
  },
  {
    id: 7, icon: '🛢️',
    brand: 'Vajra Tailam', hindi: 'वज्र तैलम्',
    cat: 'Performance Oil',
    mrp: 799, price: 549,
    benefits: ['Fast Absorption', 'Blood Flow', 'Enhanced Sensitivity'],
    ingredients: 'Nirgundi Oil, Akarkara, Clove Extract, Sesame Base, Camphor',
    usage: 'Apply gently 15 minutes before activity',
    rating: 4.7, reviews: 1923,
    show: (s) => s.performanceScore < 15 || s.erectionQuality !== 'Strong',
  },
  {
    id: 8, icon: '💪',
    brand: 'Yuva Vajra', hindi: 'युवा वज्र',
    cat: '30+ Performance',
    mrp: 1299, price: 949,
    benefits: ['Age Reversal Formula', 'Testosterone Restore', 'Energy & Drive'],
    ingredients: 'Shilajit Resin, Safed Musli, Ashwagandha, Shatavari, Swarna Makshik Bhasma',
    usage: '2 capsules morning with warm milk',
    rating: 4.9, reviews: 2567,
    show: (_s, ag) => ag === '36-45' || ag === '45+',
  },
  {
    id: 9, icon: '🔥',
    brand: 'Kaam Veerya', hindi: 'काम वीर्य',
    cat: 'Libido Boost',
    mrp: 999, price: 729,
    benefits: ['Reignite Desire', 'Hormonal Balance', 'Vitality'],
    ingredients: 'Kapikacchu, Shatavari, Gokshura, Safed Musli, Ras Sindoor, Clove',
    usage: '2 capsules after dinner',
    rating: 4.8, reviews: 2198,
    show: (s) => s.libidoLevel === 'Low' || s.performanceScore < 15,
  },
  {
    id: 10, icon: '🧬',
    brand: 'Beej Shakti', hindi: 'बीज शक्ति',
    cat: 'Sperm Health',
    mrp: 1199, price: 849,
    benefits: ['Sperm Count', 'Motility', 'Reproductive Vitality'],
    ingredients: 'Ashwagandha, Shatavari, Kapikacchu, Zinc, Selenium, Gokshura, Vidarikanda',
    usage: '2 capsules daily after breakfast',
    rating: 4.7, reviews: 1432,
    show: (s, ag) => s.physicalScore < 15 || ag === '36-45' || ag === '45+',
  },
  {
    id: 11, icon: '👑',
    brand: 'Maha Vajra', hindi: 'महावज्र',
    cat: 'Ultra Performance',
    mrp: 1999, price: 1499,
    benefits: ['Maximum Potency Formula', 'All-in-one Power', 'Premium Results'],
    ingredients: 'Shilajit Resin 500mg, Swarna Bhasma, Ashwagandha KSM-66, Safed Musli, Gokshura, Kapikacchu, Saffron',
    usage: '1 capsule morning + 1 at night with warm milk',
    rating: 5.0, reviews: 987,
    show: (s, _ag, pt) => s.vitaScore < 50 || pt === 'premium',
  },
]

function getRecommended(state) {
  const { ageGroup, planType } = state
  // Always recommend at least 2 products
  const matched = ALL_PRODUCTS.filter(p => p.show(state, ageGroup, planType))
  const limit = planType === 'premium' ? 7 : planType === 'advanced' ? 5 : 3
  const result = matched.slice(0, limit)
  // Ensure minimum 2
  if (result.length < 2) {
    const extra = ALL_PRODUCTS.filter(p => !result.find(r => r.id === p.id)).slice(0, 2 - result.length)
    return [...result, ...extra]
  }
  return result
}

export default function ProductScreen() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { vitaScore, planType, selectedAmount } = state
  const recommended = getRecommended(state)
  const planAmt = selectedAmount || 1999

  return (
    <ScreenWrapper bg={C.bgMid}>
      {/* Header */}
      <div style={{ background: C.white, padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: C.text, fontSize: 22, fontWeight: 800 }}>Your VI Kit</div>
            <div style={{ color: C.muted, fontSize: 13 }}>AI-matched for VitaScore {vitaScore}</div>
          </div>
          <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 20, padding: '4px 12px', color: C.gold, fontSize: 12, fontWeight: 700 }}>
            {(planType || 'Basic').charAt(0).toUpperCase() + (planType || 'basic').slice(1)} Plan
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 130px' }}>
        {/* Auto-match banner */}
        <div style={{ background: G.hero, borderRadius: 16, padding: 16, marginBottom: 18, boxShadow: '0 4px 16px rgba(26,14,0,0.2)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>🎯</span>
            <div>
              <div style={{ color: '#FFD700', fontSize: 14, fontWeight: 700 }}>Automatically Matched to Your Score</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>Based on VitaScore {vitaScore} · {recommended.length} formulas selected for your root causes</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 12px' }}>
            <div style={{ color: 'rgba(255,215,0,0.9)', fontSize: 12 }}>⏱️ See changes in 15 days. Best results in 3 months — stay consistent!</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 16 }}>
          <div style={{ width: 4, height: 22, background: G.gold, borderRadius: 2 }} />
          <span style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>Your Recommended Formulas</span>
        </div>

        {/* Product cards */}
        {recommended.map(p => (
          <div key={p.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: 18, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: C.goldBg, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                  {p.icon}
                </div>
                <div>
                  <div style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{p.brand}</div>
                  <div style={{ color: C.gold, fontSize: 11, fontStyle: 'italic' }}>{p.hindi}</div>
                </div>
              </div>
              <div style={{ background: '#F0FDF4', border: `1px solid ${C.green}40`, borderRadius: 20, padding: '3px 10px', color: C.green, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {p.cat}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {p.benefits.map(b => (
                <div key={b} style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 20, padding: '3px 10px', color: C.gold, fontSize: 11, fontWeight: 600 }}>{b}</div>
              ))}
            </div>

            <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>🌿 <b style={{color:C.text}}>Ingredients:</b> {p.ingredients}</div>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 10 }}>📋 <b style={{color:C.text}}>Usage:</b> {p.usage}</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: C.gold, fontSize: 12 }}>
                {'⭐'.repeat(Math.floor(p.rating))}{' '}
                <span style={{ fontWeight: 700 }}>{p.rating}</span>{' '}
                <span style={{ color: C.muted }}>({p.reviews.toLocaleString()} reviews)</span>
              </div>
              <div>
                <span style={{ color: C.subtle, fontSize: 12, textDecoration: 'line-through', marginRight: 6 }}>₹{p.mrp}</span>
                <span style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>₹{p.price}</span>
                <span style={{ color: C.green, fontSize: 11, marginLeft: 6 }}>Save ₹{p.mrp - p.price}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Bundle summary */}
        <div style={{ background: G.hero, borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: '0 4px 20px rgba(26,14,0,0.2)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 20 }}>🛍️</span>
            <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>Your Complete VI Bundle</span>
          </div>
          {recommended.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>{p.icon} {p.brand}</span>
              <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>₹{p.price}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', margin: '14px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600 }}>You Pay (Plan Price)</span>
            <span style={{ color: '#FFD700', fontSize: 22, fontWeight: 800 }}>₹{planAmt.toLocaleString()}</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>🚚 Free Home Delivery Included</div>
        </div>

        {/* Certifications */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20, background: C.white, borderRadius: 16, padding: 16, border: `1px solid ${C.border}`, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          {['FSSAI\nCertified', 'Lab\nTested', '100%\nNatural', 'Ancient\nFormulas'].map(t => (
            <div key={t} style={{ textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.goldBg, border: `1.5px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontSize: 18 }}>✅</div>
              <div style={{ color: C.muted, fontSize: 9, whiteSpace: 'pre-line', fontWeight: 600 }}>{t}</div>
            </div>
          ))}
        </div>

        {/* Results timeline */}
        <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ color: C.gold, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>⏱️ What to Expect</div>
          {[
            { wk: '15 days', label: 'Noticeable energy improvements begin' },
            { wk: '1 month', label: 'Visible performance & confidence boost' },
            { wk: '3 months', label: 'Complete transformation — best results' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 2 ? 10 : 0 }}>
              <div style={{ background: G.gold, borderRadius: 10, padding: '3px 10px', color: C.onGold, fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{item.wk}</div>
              <div style={{ color: C.text, fontSize: 13 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 20, border: `1px solid ${C.border}`, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 14 }}>How It Works</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {[{ n: '①', l: 'Order Kit' }, { n: '②', l: 'Start Routine' }, { n: '③', l: 'Track Daily' }, { n: '④', l: 'See Results' }].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: G.gold, color: C.onGold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, margin: '0 auto 4px' }}>{item.n}</div>
                  <div style={{ color: C.muted, fontSize: 9, textAlign: 'center' }}>{item.l}</div>
                </div>
                {i < 3 && <div style={{ width: 18, height: 2, background: G.gold, margin: '0 2px', marginBottom: 14 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROMINENT CHECKOUT BAR */}
      <BottomBar>
        <div style={{ background: C.goldBg, border: `1px solid ${C.goldBorder}`, borderRadius: 10, padding: '8px 12px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: C.muted, fontSize: 11 }}>{recommended.length} formulas · {(planType || 'Basic')} Plan</div>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 800 }}>₹{planAmt.toLocaleString()} <span style={{ color: C.green, fontSize: 12, fontWeight: 600 }}>· Free Delivery</span></div>
          </div>
          <div style={{ color: C.green, fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
            ⏱ 15 days to<br/>first results
          </div>
        </div>
        <GoldBtn onClick={() => navigate('/social-proof')} height={56}>
          🛒 Proceed to Checkout →
        </GoldBtn>
        <div style={{ textAlign: 'center', color: C.muted, fontSize: 11, marginTop: 8 }}>🔒 Secure 256-bit Encrypted · Powered by Razorpay</div>
      </BottomBar>
    </ScreenWrapper>
  )
}
