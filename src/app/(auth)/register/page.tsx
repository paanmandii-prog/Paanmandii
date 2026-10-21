'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { registerSchema } from '@/lib/validations'
import { Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/account'

  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [shopName, setShopName] = useState('')
  const [gstin, setGstin] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsed = registerSchema.safeParse({
      full_name: fullName,
      mobile,
      shop_name: shopName,
      gstin: gstin || undefined,
      email,
      password,
      confirm_password: confirmPassword,
    })

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message)
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            mobile,
            shop_name: shopName,
            gstin: gstin || null,
          },
        },
      })

      if (error) {
        toast.error(error.message || 'Registration failed')
        return
      }

      // If user profile needs explicit upsert in profiles table
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          mobile,
          shop_name: shopName || null,
          gstin: gstin || null,
        })
      }

      toast.success('Registration successful! Welcome to PAAN MANDI.')
      router.push(redirectUrl)
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during account creation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-black text-gray-900">
          Create Wholesale Account
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Join thousands of verified paan shop owners buying direct from Mandi
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Full Name / Proprietor Name *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Anand Chaurasia"
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit number"
              maxLength={10}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Shop Name (Optional)
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="e.g. Shiva Paan Corner"
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            GSTIN (Optional — for tax invoice input credit)
          </label>
          <input
            type="text"
            value={gstin}
            onChange={(e) => setGstin(e.target.value.toUpperCase())}
            placeholder="15-character GST number"
            maxLength={15}
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 uppercase focus:border-green-600 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="shop@example.com"
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 chars (1 upper, 1 num)"
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-green-700 py-3 px-4 text-sm font-bold text-white shadow-md transition hover:bg-green-800 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Registering Account...
            </>
          ) : (
            <>
              Register Wholesale Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500">
          Already have an account?{' '}
          <Link
            href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
            className="font-bold text-green-700 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-gray-400">Loading form...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
