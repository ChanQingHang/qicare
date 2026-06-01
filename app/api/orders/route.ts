import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function generateOrderNumber(): string {
  const now = new Date()
  const ymd =
    `${now.getFullYear()}` +
    `${String(now.getMonth() + 1).padStart(2, '0')}` +
    `${String(now.getDate()).padStart(2, '0')}`
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `MYTCM-${ymd}-${rand}`
}

export async function POST(request: NextRequest) {
  let body: {
    customerName?: string
    customerPhone?: string
    customerAddress?: string
    paymentMethod?: string
    items?: unknown[]
    totalAmount?: number
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { customerName, customerPhone, customerAddress, paymentMethod, items, totalAmount } = body

  if (
    !customerName?.trim() ||
    !customerPhone?.trim() ||
    !customerAddress?.trim() ||
    !paymentMethod ||
    !Array.isArray(items) ||
    totalAmount == null
  ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const orderNumber = generateOrderNumber()

  if (!supabase) {
    console.log('[orders] Supabase not configured — order logged locally:', {
      orderNumber,
      customerName,
      paymentMethod,
      totalAmount,
    })
    return NextResponse.json({ orderNumber, status: 'pending' })
  }

  const { error } = await supabase.from('orders').insert({
    order_number: orderNumber,
    customer_name: customerName.trim(),
    customer_phone: customerPhone.trim(),
    customer_address: customerAddress.trim(),
    payment_method: paymentMethod,
    items,
    total_amount: totalAmount,
    currency: 'MYR',
    status: 'pending',
  })

  if (error) {
    console.error('[orders] Supabase insert error:', error)
    return NextResponse.json({ error: 'Database error', detail: error.message }, { status: 500 })
  }

  return NextResponse.json({ orderNumber, status: 'pending' })
}
