import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, phone, speciality, experience, bio, registration_no } = body

  if (!name || !phone || !registration_no) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!supabase) {
    // No Supabase configured — log and return success for development
    console.log('[apply] Supabase not configured. Application data:', body)
    return NextResponse.json({ success: true, message: 'Application received (dev mode)' })
  }

  const { error } = await supabase.from('doctor_applications').insert([
    {
      name,
      phone,
      speciality: speciality || null,
      experience: experience || null,
      bio: bio || null,
      registration_no,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    },
  ])

  if (error) {
    console.error('[apply] Supabase error:', error)
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
