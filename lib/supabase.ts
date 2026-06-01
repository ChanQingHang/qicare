import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export interface CaseStudy {
  id: string
  category: string
  category_en: string
  title: string
  title_en: string
  description: string
  description_en: string
  treatment_plan: string[]
  treatment_plan_en: string[]
  image_url: string
  doctor_name: string
}

export interface DoctorApplication {
  name: string
  phone: string
  speciality: string
  experience: number
  bio: string
  registration_no: string
}
