-- ============================================================
-- QiCare Supabase Schema
-- Run this in your Supabase SQL Editor to create the tables.
-- ============================================================

-- Doctor Applications Table
create table if not exists doctor_applications (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  phone        text not null,
  speciality   text,
  experience   int,
  bio          text,
  registration_no text not null,
  status       text default 'pending', -- pending | approved | rejected
  submitted_at timestamptz default now()
);

-- Enable RLS (Row Level Security)
alter table doctor_applications enable row level security;

-- Allow inserts from authenticated + anonymous (via anon key)
create policy "Allow public insert" on doctor_applications
  for insert with check (true);

-- Only allow admins to read (set up service key for admin panel)
create policy "Allow admin read" on doctor_applications
  for select using (auth.role() = 'service_role');


-- Case Studies Table
create table if not exists cases (
  id              uuid primary key default gen_random_uuid(),
  category        text not null,
  category_en     text not null,
  title           text not null,
  title_en        text not null,
  description     text not null,
  description_en  text not null,
  treatment_plan  text[] not null default '{}',
  treatment_plan_en text[] not null default '{}',
  image_url       text,
  doctor_name     text,
  created_at      timestamptz default now()
);

alter table cases enable row level security;

-- Anyone can read cases
create policy "Allow public read" on cases
  for select using (true);

-- Only service role can insert/update
create policy "Allow admin write" on cases
  for all using (auth.role() = 'service_role');


-- Sample Data (optional)
insert into cases (category, category_en, title, title_en, description, description_en, treatment_plan, treatment_plan_en, image_url, doctor_name)
values
  (
    '脾胃 · 内科',
    'Spleen & Stomach',
    '反复胃胀两年，八周调理改善',
    'Chronic Bloating for 2 Years — Resolved in 8 Weeks',
    '45岁男性，长期饭后腹胀、嗳气。辨证脾虚气滞，以健脾理气为法，配合饮食调整，八周后症状明显缓解。',
    'Male, 45. Chronic post-meal bloating and belching. Significant relief after 8 weeks of herbal treatment.',
    array['辨证：脾虚气滞', '治法：健脾益气、理气和胃', '方向：香砂六君子加减', '配合：三餐定时、忌生冷'],
    array['Pattern: Spleen Qi Deficiency', 'Method: Tonify Spleen Qi', 'Formula: Xiang Sha Liu Jun Zi', 'Lifestyle: Regular meals'],
    'https://images.unsplash.com/photo-1610847499832-918a1c3c6811?auto=format&fit=crop&w=600&q=70',
    '李明华'
  );
