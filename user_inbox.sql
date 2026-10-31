-- ============================================================
-- user_inbox.sql — صندوق رسائل المستخدمين داخل الموقع
-- ردود الإدارة على رسائل التواصل تصل إلى صندوق المستخدم في حسابه
-- ينفَّذ مرة واحدة في Supabase → SQL Editor (آمن للتكرار)
-- ============================================================

-- 1) جدول صندوق الرسائل
create table if not exists public.user_inbox (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  user_email text,
  user_name text,
  title text not null default 'رسالة من إدارة إسبانيول',
  body text not null,
  in_reply_to uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2) الحماية: كل مستخدم يرى صندوقه هو فقط، ويعلّم رسائله كمقروءة
alter table public.user_inbox enable row level security;

drop policy if exists "user reads own inbox" on public.user_inbox;
create policy "user reads own inbox"
  on public.user_inbox for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "user marks own inbox read" on public.user_inbox;
create policy "user marks own inbox read"
  on public.user_inbox for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- الإدراج والحذف للإدارة فقط عبر service_role (بلا سياسات عامة — عمداً)

-- 3) ربط رسائل التواصل بحساب صاحبها — لتوجيه الرد إلى صندوقه تلقائياً
alter table public.contact_messages add column if not exists user_id uuid;
