'use client'

import React, { useState } from 'react'
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSent, setIsSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSent(true)
      toast.success('Your message has been sent to the Mandi desk!')
    }, 600)
  }

  return (
    <div className="bg-gray-50/60 min-h-screen py-10 md:py-16">
      <div className="container-site max-w-5xl">
        <div className="mb-12 text-center max-w-xl mx-auto">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3.5 py-1 text-xs font-bold text-green-800">
            <MessageSquare className="h-3.5 w-3.5" />
            Wholesale Helpdesk
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Contact PAAN MANDI
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Have questions about large bulk orders, delivery timelines, or product grades? Our team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="md:col-span-1 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Support</h4>
                  <a href="tel:+919876543210" className="text-sm font-bold text-gray-900 hover:text-green-700">
                    +91 98765 43210
                  </a>
                  <p className="text-[11px] text-gray-400 mt-0.5">Mon–Sat, 8 AM to 8 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Inquiries</h4>
                  <a href="mailto:support@paanmandi.in" className="text-sm font-bold text-gray-900 hover:text-green-700">
                    support@paanmandi.in
                  </a>
                  <p className="text-[11px] text-gray-400 mt-0.5">Response within 4 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Central Mandi Hub</h4>
                  <p className="text-sm text-gray-800 leading-snug">
                    Plot 45, Wholesale Agricultural Mandi Complex, Varanasi, UP – 221001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Dispatch Window</h4>
                  <p className="text-sm text-gray-800">
                    Daily 5:00 AM – 11:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="md:col-span-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
              {isSent ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Received!</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                    Our wholesale team will review your requirement and call you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSent(false)
                      setName('')
                      setMobile('')
                      setSubject('')
                      setMessage('')
                    }}
                    className="rounded-xl bg-green-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-green-800"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Send Wholesale Inquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Gupta"
                        className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Mobile Number *
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

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Subject / Product Required *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Bulk Magahi Paan Leaves 500 Dholi Requirement"
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Message / Special Specifications *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Specify your daily/weekly consumption, delivery location, or questions..."
                      className="w-full rounded-xl border border-gray-300 p-3.5 text-sm text-gray-900 focus:border-green-600 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-700 py-3 px-6 text-sm font-bold text-white shadow-md hover:bg-green-800 transition active:scale-98"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
