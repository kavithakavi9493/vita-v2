import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, addDoc, collection, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useApp } from '../context/AppContext'
import { GoldBtn, ScreenWrapper, Toast, Toggle } from '../components/UI'
import { C, G } from '../constants/colors'

function Field({ label, value, onChange, type = 'text', maxLength, readOnly = false }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 4 }}>{label}</div>
      <input
        type={type} value={value} maxLength={maxLength}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        readOnly={readOnly}
        style={{
          width: '100%', height: 50, background: readOnly ? C.border : C.card,
          border: `1px solid ${focused ? C.gold : C.border}`,
          borderRadius: 12, color: readOnly ? C.muted : C.white,
          fontSize: 14, padding: '0 16px', transition: 'border-color .2s',
        }}
      />
    </div>
  )
}

export default function CheckoutScreen() {
  const navigate  = useNavigate()
  const { state } = useApp()
  const { userName, phone, email, planType, selectedAmount, userId } = state

  const [form, setForm] = useState({ name: userName || '', phone: phone || '', pincode: '', addr1: '', addr2: '', city: '', state: '' })
  const [coupon,  setCoupon]  = useState('')
  const [disc,    setDisc]    = useState(0)
  const [open,    setOpen]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [pinLoad, setPinLoad] = useState(false)
  const [toast,   setToast]   = useState(null)
  const [saveAddr, setSaveAddr] = useState(true)

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const finalAmt = Math.max(0, (selectedAmount || 5999) - disc)

  // Auto-fill city/state from pincode
  const handlePincode = async (val) => {
    up('pincode', val.slice(0, 6))
    if (val.length === 6) {
      setPinLoad(true)
      try {
        const res  = await fetch(`https://api.postalpincode.in/pincode/${val}`)
        const data = await res.json()
        if (data[0]?.Status === 'Success') {
          const po = data[0].PostOffice[0]
          up('city',  po.District)
          up('state', po.State)
          setToast({ msg: '✅ Location verified', type: 'success' })
        } else {
          setToast({ msg: 'Invalid pincode. Please check.', type: 'error' })
        }
      } catch {
        setToast({ msg: 'Could not verify pincode.', type: 'error' })
      } finally {
        setPinLoad(false)
      }
    }
  }

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'VI20') {
      setDisc(Math.round((selectedAmount || 5999) * 0.2))
      setToast({ msg: `₹${Math.round((selectedAmount || 5999) * 0.2)} saved! 🎉`, type: 'success' })
    } else if (coupon.toUpperCase() === 'VI10') {
      setDisc(Math.round((selectedAmount || 5999) * 0.1))
      setToast({ msg: `₹${Math.round((selectedAmount || 5999) * 0.1)} saved! 🎉`, type: 'success' })
    } else {
      setToast({ msg: 'Invalid or expired coupon code', type: 'error' })
    }
  }

  const isValid = form.name.length >= 3 && form.phone.length === 10 && form.pincode.length === 6 && form.addr1 && form.city && form.state

  const handlePay = async () => {
    if (!isValid) return
    setLoading(true)
    try {
      // Create order in Firestore
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId,
        planType,
        amount: finalAmt,
        status: 'pending',
        createdAt: serverTimestamp(),
        shipping: { name: form.name, phone: form.phone, addressLine1: form.addr1, addressLine2: form.addr2, city: form.city, state: form.state, pincode: form.pincode },
      })

      // Call backend to create Razorpay order
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const rpRes = await fetch(`${backendUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmt, planType, userId }),
      })
      const rpData = await rpRes.json()

      // Open Razorpay
      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXX',
        amount:      finalAmt * 100,
        currency:    'INR',
        name:        'VI — Vita Intelligence',
        description: `${planType} Plan`,
        order_id:    rpData.orderId,
        theme:       { color: '#FFD700' },
        prefill:     { name: form.name, contact: `+91${form.phone}`, email: email || '' },
        handler: async (response) => {
          // Verify on backend
          try {
            await fetch(`${backendUrl}/api/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                userId, orderId: orderRef.id,
              }),
            })
            await updateDoc(doc(db, 'orders', orderRef.id), { status: 'paid', paymentId: response.razorpay_payment_id })
            navigate('/success', { replace: true })
          } catch {
            navigate('/failure', { replace: true })
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      }

      // If Razorpay SDK not loaded, simulate for dev
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', async () => {
          await updateDoc(doc(db, 'orders', orderRef.id), { status: 'failed' })
          navigate('/failure', { replace: true })
        })
        rzp.open()
      } else {
        // Dev mode — simulate success
        console.warn('Razorpay SDK not loaded — simulating success for dev')
        await updateDoc(doc(db, 'orders', orderRef.id), { status: 'paid', paymentId: 'dev_test_' + Date.now() })
        navigate('/success', { replace: true })
      }
    } catch (err) {
      console.error(err)
      setToast({ msg: 'Something went wrong. Please try again.', type: 'error' })
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper>
      <div style={{ padding: '24px 24px 120px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ color: C.white, fontSize: 22, fontWeight: 700 }}>Checkout</div>
            <div style={{ color: C.muted, fontSize: 13 }}>Final step — almost there</div>
          </div>
          <div style={{ background: C.goldBg, border: `1px solid ${C.gold}`, borderRadius: 20, padding: '4px 12px', color: C.gold, fontSize: 12, fontWeight: 600 }}>🔒 100% Secure</div>
        </div>

        {/* Order summary */}
        <div style={{ background: C.goldBg, border: `1px solid ${C.gold}`, borderRadius: 16, padding: 16, marginBottom: 18 }}>
          <div onClick={() => setOpen(!open)} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ color: C.white, fontSize: 15, fontWeight: 600 }}>Order Summary</div>
              <div style={{ background: C.goldBg, border: `1px solid ${C.gold}`, borderRadius: 20, padding: '2px 10px', color: C.gold, fontSize: 11, display: 'inline-block', marginTop: 4 }}>
                {(planType || 'advanced').charAt(0).toUpperCase() + (planType || 'advanced').slice(1)} Plan
              </div>
            </div>
            <span style={{ color: C.gold, fontSize: 18 }}>{open ? '▲' : '▼'}</span>
          </div>
          {open && (
            <div style={{ marginTop: 12, borderTop: `1px solid ${C.goldBorder}`, paddingTop: 12 }}>
              {[
                { l: 'Plan Price', v: `₹${selectedAmount || 5999}` },
                { l: 'Delivery',   v: 'FREE', vc: C.green },
                disc > 0 && { l: 'Discount', v: `-₹${disc}`, vc: C.green },
              ].filter(Boolean).map(item => (
                <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: C.muted, fontSize: 13 }}>{item.l}</span>
                  <span style={{ color: item.vc || C.white, fontSize: 13 }}>{item.v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.goldBorder}`, paddingTop: 8 }}>
                <span style={{ color: C.white, fontSize: 14, fontWeight: 600 }}>Total</span>
                <span style={{ color: C.gold, fontSize: 16, fontWeight: 700 }}>₹{finalAmt}</span>
              </div>
            </div>
          )}
        </div>

        {/* Delivery address */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ width: 4, height: 20, background: C.gold, borderRadius: 2 }} />
            <span style={{ color: C.white, fontSize: 16, fontWeight: 700 }}>Delivery Address</span>
          </div>
          <Field label="Full Name *"     value={form.name}   onChange={v => up('name', v)} />
          <Field label="Phone Number *"  value={form.phone}  onChange={v => up('phone', v.replace(/\D/g,'').slice(0,10))} type="tel" />
          <div>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 4 }}>Pincode * {pinLoad && <span style={{ color: C.gold }}>Verifying...</span>}</div>
            <input
              type="number" value={form.pincode} maxLength={6}
              onChange={e => handlePincode(e.target.value)}
              placeholder="6-digit pincode"
              style={{ width: '100%', height: 50, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, color: C.white, fontSize: 14, padding: '0 16px', marginBottom: 12 }}
            />
          </div>
          <Field label="Address Line 1 *"  value={form.addr1}  onChange={v => up('addr1', v)} />
          <Field label="Address Line 2"    value={form.addr2}  onChange={v => up('addr2', v)} />
          <Field label="City *"            value={form.city}   onChange={v => up('city', v)} />
          <Field label="State *"           value={form.state}  onChange={v => up('state', v)} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <span style={{ color: C.muted, fontSize: 13 }}>Save this address</span>
            <Toggle on={saveAddr} onToggle={() => setSaveAddr(!saveAddr)} />
          </div>
        </div>

        {/* Payment method */}
        <div style={{ background: C.card, border: `1px solid ${C.gold}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ color: C.white, fontSize: 15, fontWeight: 600 }}>Payment Method</div>
            <div style={{ color: C.muted, fontSize: 12 }}>Secured by Razorpay</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[{ i: '📱', l: 'UPI' }, { i: '💳', l: 'Card' }, { i: '🏦', l: 'Net Banking' }, { i: '👛', l: 'Wallets' }].map(m => (
              <div key={m.l} style={{ background: '#111', border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: 18 }}>{m.i}</span>
                <span style={{ color: C.white, fontSize: 13 }}>{m.l}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 10, color: C.muted, fontSize: 11 }}>
            🔒 256-bit SSL &nbsp; 🛡️ PCI DSS &nbsp; ✅ RBI Approved
          </div>
        </div>

        {/* Coupon */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10 }}>
          <input
            value={coupon} onChange={e => setCoupon(e.target.value)}
            placeholder="Enter coupon code (try VI20)"
            style={{ flex: 1, background: 'transparent', border: 'none', color: C.white, fontSize: 14 }}
          />
          <button
            onClick={applyCoupon}
            style={{ background: G.gold, border: 'none', borderRadius: 8, padding: '6px 14px', color: C.onGold, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            Apply
          </button>
        </div>

        {/* Total */}
        <div style={{ background: C.goldBg, border: `1px solid ${C.gold}`, borderRadius: 12, padding: '14px 16px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: C.muted, fontSize: 12 }}>Total Payable</div>
            <div style={{ color: C.gold, fontSize: 28, fontWeight: 800 }}>₹{finalAmt}</div>
          </div>
          <div style={{ color: C.green, fontSize: 13 }}>🚚 Free Delivery</div>
        </div>
      </div>

      {/* Sticky pay button */}
      <div style={{ position: 'sticky', bottom: 0, padding: '14px 24px 20px', background: 'rgba(10,10,10,0.97)', borderTop: `1px solid ${C.border}` }}>
        <GoldBtn onClick={handlePay} disabled={!isValid || loading} height={62} style={{ marginBottom: 8, fontSize: 16 }}>
          {loading ? 'Processing...' : `Pay ₹${finalAmt} Securely →`}
        </GoldBtn>
        <div style={{ textAlign: 'center', color: C.muted, fontSize: 11 }}>🔒 256-bit Encrypted | Powered by Razorpay</div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </ScreenWrapper>
  )
}
