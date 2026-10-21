import { Resend } from 'resend'

export const ADMIN_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || 'paanmandii@gmail.com'

interface OrderEmailData {
  orderNumber: string
  customerEmail?: string
  fulfillmentMethod: string
  deliveryAddress?: {
    full_name?: string
    phone?: string
    address_line1?: string
    address_line2?: string
    city?: string
    state?: string
    pincode?: string
    landmark?: string
  } | null
  items: Array<{
    name: string
    quantity: number
    unit?: string
    lineTotalFormatted: string
  }>
  subtotalFormatted: string
  deliveryFeeFormatted: string
  totalFormatted: string
  paymentMethod: string
  customerNote?: string | null
}

export async function sendOrderNotificationEmail(data: OrderEmailData) {
  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = ADMIN_NOTIFICATION_EMAIL

  console.log(`[PAAN MANDI] 📦 New Order Notification: ${data.orderNumber} for ₹${data.totalFormatted}`)
  console.log(`[PAAN MANDI] Recipient: ${adminEmail}`)

  // Generate plain-text and HTML versions
  const addressText = data.deliveryAddress
    ? `${data.deliveryAddress.full_name || 'Customer'}
Phone: ${data.deliveryAddress.phone || 'N/A'}
Address: ${data.deliveryAddress.address_line1 || ''} ${data.deliveryAddress.address_line2 || ''}
${data.deliveryAddress.city || ''}, ${data.deliveryAddress.state || ''} - ${data.deliveryAddress.pincode || ''}
${data.deliveryAddress.landmark ? `Landmark: ${data.deliveryAddress.landmark}` : ''}`
    : 'Shop Pickup (No delivery address required)'

  const itemsList = data.items
    .map(
      (item) =>
        `• ${item.name} × ${item.quantity} ${item.unit || ''} — ${item.lineTotalFormatted}`
    )
    .join('\n')

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; color: #1f2937;">
      <div style="background-color: #14532d; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: -0.5px;">🌿 PAAN MANDI</h1>
        <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Naya Wholesale Order Aaya Hai!</p>
      </div>
      
      <div style="padding: 24px;">
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
          <strong style="color: #166534; font-size: 16px;">Order #${data.orderNumber}</strong>
          <span style="float: right; color: #166534; font-weight: bold; font-size: 16px;">${data.totalFormatted}</span>
        </div>

        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-bottom: 8px;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Method:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right; font-size: 14px; text-transform: uppercase;">${data.paymentMethod}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Fulfillment:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right; font-size: 14px; text-transform: capitalize;">${data.fulfillmentMethod}</td>
          </tr>
          ${
            data.customerEmail
              ? `<tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Customer Email:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right; font-size: 14px;">${data.customerEmail}</td>
          </tr>`
              : ''
          }
        </table>

        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-bottom: 8px;">Products Ordered</h3>
        <div style="background: #f9fafb; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
          ${data.items
            .map(
              (item) => `
            <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; border-bottom: 1px dashed #e5e7eb;">
              <span><strong>${item.name}</strong> × ${item.quantity} ${item.unit || ''}</span>
              <span style="font-weight: 600;">${item.lineTotalFormatted}</span>
            </div>
          `
            )
            .join('')}
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 14px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #6b7280;">Subtotal:</span>
              <span>${data.subtotalFormatted}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #6b7280;">Delivery Fee:</span>
              <span>${data.deliveryFeeFormatted}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; color: #14532d; padding-top: 4px;">
              <span>Total:</span>
              <span>${data.totalFormatted}</span>
            </div>
          </div>
        </div>

        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-bottom: 8px;">Shipping / Delivery Details</h3>
        <div style="background: #f9fafb; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 14px; line-height: 1.5; white-space: pre-line;">
          ${addressText}
        </div>

        ${
          data.customerNote
            ? `
          <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-bottom: 8px;">Customer Note</h3>
          <p style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px; font-size: 13px; color: #92400e; margin: 0;">${data.customerNote}</p>
        `
            : ''
        }
      </div>

      <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
        PAAN MANDI — Aapki Paan Ki Dukaan, Ab Online!<br/>
        This email was automatically sent to <strong>${adminEmail}</strong> upon receiving a new order.
      </div>
    </div>
  `

  if (apiKey && !apiKey.includes('placeholder')) {
    try {
      const resend = new Resend(apiKey)
      const res = await resend.emails.send({
        from: 'PAAN MANDI Orders <orders@paanmandi.com>',
        to: [adminEmail],
        subject: `🌿 New Order #${data.orderNumber} received (${data.totalFormatted})`,
        text: `PAAN MANDI - New Order #${data.orderNumber}\n\nTotal: ${data.totalFormatted}\nPayment: ${data.paymentMethod}\nFulfillment: ${data.fulfillmentMethod}\n\nItems:\n${itemsList}\n\nDelivery Info:\n${addressText}\n\nSubtotal: ${data.subtotalFormatted}\nDelivery: ${data.deliveryFeeFormatted}\nTotal: ${data.totalFormatted}`,
        html: htmlContent,
      })
      console.log('[PAAN MANDI] Resend email sent successfully:', res)
      return { success: true, res }
    } catch (err) {
      console.error('[PAAN MANDI] Failed to send via Resend:', err)
    }
  } else {
    console.log('[PAAN MANDI] RESEND_API_KEY is not configured or placeholder. Order details logged above for notification.')
  }

  return { success: true, simulated: true }
}
