'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  ShieldCheck,
  Truck,
  Store,
  CreditCard,
  Banknote,
  QrCode,
  ArrowRight,
  MapPin,
  FileText,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

declare global {
  interface Window {
    Razorpay?: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, summary, clearCart, isLoading: isCartLoading } = useCart()
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  // Fulfillment & Payment state
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'delivery' | 'pickup'>('delivery')
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay' | 'upi'>('cod')
  const [customerNote, setCustomerNote] = useState('')

  // Address fields
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [shopName, setShopName] = useState('')
  const [gstin, setGstin] = useState('')
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Uttar Pradesh')
  const [pincode, setPincode] = useState('')

  // Delivery fee computation state
  const [deliveryFeePaise, setDeliveryFeePaise] = useState(0)
  const [isCalculatingFee, setIsCalculatingFee] = useState(false)
  const [isServiceable, setIsServiceable] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check auth and prefill profile
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setFullName(profile.full_name || '')
          setMobile(profile.mobile || '')
          setShopName(profile.shop_name || '')
          setGstin(profile.gstin || '')
        }
      }
      setIsAuthChecking(false)
    }
    loadUser()
  }, [supabase])

  // Dynamically calculate delivery fee when PIN code changes
  useEffect(() => {
    if (fulfillmentMethod === 'pickup') {
      setDeliveryFeePaise(0)
      return
    }

    if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
      setIsCalculatingFee(true)
      fetch('/api/checkout/delivery-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pincode,
          subtotal_paise: summary.subtotal_paise,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.is_serviceable) {
            setDeliveryFeePaise(data.fee_paise || 0)
            setIsServiceable(true)
          } else {
            setIsServiceable(false)
            setDeliveryFeePaise(0)
            toast.error(data.message || 'Delivery is currently unavailable for this PIN code')
          }
        })
        .catch(() => {
          // Fallback
          setDeliveryFeePaise(summary.subtotal_paise >= 500000 ? 0 : 25000)
        })
        .finally(() => setIsCalculatingFee(false))
    }
  }, [pincode, summary.subtotal_paise, fulfillmentMethod])

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (isCartLoading || isAuthChecking) {
    return (
      <div className="container-site py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-700 mb-4" />
        <p className="text-sm font-medium text-gray-500">Preparing checkout...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-site py-20 text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 mb-6">Please add items to your cart before proceeding to checkout.</p>
        <Link
          href="/products"
          className="inline-flex rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white hover:bg-green-800"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  const grandTotalPaise = summary.subtotal_paise + summary.tax_paise + (fulfillmentMethod === 'delivery' ? deliveryFeePaise : 0)

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please log in or register to place your wholesale order')
      router.push('/login?redirect=/checkout')
      return
    }

    if (fulfillmentMethod === 'delivery') {
      if (!fullName.trim() || !mobile.trim() || !line1.trim() || !city.trim() || !pincode.trim()) {
        toast.error('Please fill in all mandatory delivery address fields')
        return
      }
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        toast.error('Enter a valid 10-digit Indian mobile number')
        return
      }
      if (!/^\d{6}$/.test(pincode)) {
        toast.error('Enter a valid 6-digit PIN code')
        return
      }
    }

    setIsSubmitting(true)

    try {
      const payload = {
        fulfillment_method: fulfillmentMethod,
        delivery_address: fulfillmentMethod === 'delivery' ? {
          recipient_name: fullName,
          mobile,
          shop_name: shopName || null,
          gstin: gstin || null,
          line1,
          line2: line2 || null,
          city,
          state,
          pincode,
        } : null,
        payment_method: paymentMethod,
        customer_note: customerNote || null,
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order')
      }

      const orderNumber = data.order.order_number
      const orderId = data.order.id

      // If Razorpay payment
      if ((paymentMethod === 'razorpay' || paymentMethod === 'upi') && data.razorpay_order_id && window.Razorpay) {
        const options = {
          key: data.razorpay_key_id,
          amount: data.order.total_paise,
          currency: 'INR',
          name: 'PAAN MANDI',
          description: `Order #${orderNumber}`,
          order_id: data.razorpay_order_id,
          prefill: {
            name: fullName,
            contact: mobile,
            email: user.email,
          },
          theme: {
            color: '#15803d',
          },
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/checkout/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_id: orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              })

              if (verifyRes.ok) {
                clearCart()
                router.push(`/order-success?order_number=${orderNumber}`)
              } else {
                toast.error('Payment verification failed. Please check with support.')
              }
            } catch (err) {
              console.error(err)
            }
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
        setIsSubmitting(false)
        return
      }

      // COD or Mock flow
      clearCart()
      toast.success('Order placed successfully!')
      router.push(`/order-success?order_number=${orderNumber}`)
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong while placing your order')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50/60 min-h-screen py-8 md:py-12">
      <div className="container-site">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Wholesale Checkout
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Provide business delivery details and select payment method
          </p>
        </div>

        {!user && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-700 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-950">
                  Wholesale Buyer Account Required
                </h4>
                <p className="text-xs text-amber-800">
                  Please log in or register to record this order against your GST profile.
                </p>
              </div>
            </div>
            <Link
              href="/login?redirect=/checkout"
              className="rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white hover:bg-amber-800 transition text-center"
            >
              Log In / Register
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Columns: Address & Fulfillment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fulfillment Selector */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
                1. Select Fulfillment Method
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentMethod('delivery')}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    fulfillmentMethod === 'delivery'
                      ? 'border-green-600 bg-green-50/70 text-green-950 ring-2 ring-green-600/20'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Truck className="h-5 w-5 text-green-700" />
                  <div>
                    <div className="text-sm font-bold">Mandi Delivery</div>
                    <div className="text-[11px] text-gray-500">To your shop or warehouse</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentMethod('pickup')}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    fulfillmentMethod === 'pickup'
                      ? 'border-green-600 bg-green-50/70 text-green-950 ring-2 ring-green-600/20'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Store className="h-5 w-5 text-green-700" />
                  <div>
                    <div className="text-sm font-bold">Self Pickup</div>
                    <div className="text-[11px] text-gray-500">From Mandi main counter</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Address Details */}
            {fulfillmentMethod === 'delivery' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-700" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    2. Shop & Delivery Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name / Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number (WhatsApp Enabled) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Shop / Business Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g. Banaras Paan Bhandar"
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      GSTIN (Optional for Tax Credit)
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="15-character GST number"
                      maxLength={15}
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 uppercase focus:border-green-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Street Address / Shop No / Gali *
                  </label>
                  <input
                    type="text"
                    required
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="Shop No. 12, Main Mandi Road"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City / Mandi Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Varanasi"
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      PIN Code (6 Digits) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="221001"
                        maxLength={6}
                        className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
                      />
                      {isCalculatingFee && (
                        <div className="absolute right-3 top-3">
                          <Loader2 className="h-4 w-4 animate-spin text-green-700" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-700" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  3. Payment Method
                </h2>
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="h-4 w-4 text-green-700 focus:ring-green-600"
                    />
                    <Banknote className="h-5 w-5 text-green-700" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        Cash on Delivery (COD) / Pay on Mandi Delivery
                      </div>
                      <div className="text-xs text-gray-500">
                        Pay cash directly to our delivery executive
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Zero Extra Fee
                  </span>
                </label>

                <label className="flex items-center justify-between rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="h-4 w-4 text-green-700 focus:ring-green-600"
                    />
                    <QrCode className="h-5 w-5 text-green-700" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        Online UPI / Cards / Net Banking (Razorpay)
                      </div>
                      <div className="text-xs text-gray-500">
                        Instant payment via Google Pay, PhonePe, Paytm, or Bank
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                    Fast & Verified
                  </span>
                </label>
              </div>
            </div>

            {/* Special Instructions / Notes */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                Order Notes / Delivery Time Instructions
              </label>
              <textarea
                rows={2}
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="e.g. Please deliver before 9:00 AM before our retail rush."
                className="w-full rounded-xl border border-gray-300 p-3 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              {/* Items List Preview */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-gray-100 pr-1">
                {items.map((item) => (
                  <div key={item.product_id} className="pt-2 flex justify-between text-xs">
                    <div>
                      <div className="font-bold text-gray-900">{item.product_name}</div>
                      <div className="text-gray-500">
                        {item.quantity} {item.product_unit} × {formatPrice(item.unit_price_paise)}
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatPrice(item.line_total_paise)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(summary.subtotal_paise)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>GST (Tax)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(summary.tax_paise)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Freight</span>
                  <span className="font-semibold text-gray-900">
                    {fulfillmentMethod === 'pickup' ? (
                      <span className="text-green-700 font-bold">Free (Pickup)</span>
                    ) : deliveryFeePaise === 0 ? (
                      <span className="text-green-700 font-bold">Free</span>
                    ) : (
                      formatPrice(deliveryFeePaise)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Total Payable</span>
                  <span className="text-2xl font-black text-green-800">
                    {formatPrice(grandTotalPaise)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isServiceable}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-700 py-4 px-6 text-base font-bold text-white shadow-md transition hover:bg-green-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Confirm & Place Order
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-green-700" />
                <span>Legally compliant wholesale transaction</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
