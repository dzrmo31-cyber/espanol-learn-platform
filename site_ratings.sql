-- ============================================================
-- site_ratings.sql — تقييم الموقع بالنجوم (من 0.5 إلى 5، بخطوة نصف نجمة)
-- ينفَّذ مرة واحدة في Supabase → SQL Editor (آمن للتكرار)
-- كل مستخدم له تقييم واحد يستطيع تعديله أو حذفه. المتوسط والعدد يظهران للجميع،
-- أما تقييمات الآخرين فلا يراها أحد من الموقع (الأدمن يراها من لوحته).
-- ============================================================

create table if not exists public.site_ratings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  rating numeric(2,1) not null check (rating >= 0.5 and rating <= 5 and (rating * 2) = floor(rating * 2)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- الحماية: لا وصول مباشر للجدول، كل شيء عبر الدوال أدناه
alter table public.site_ratings enable row level security;

create or replace function public.submit_site_rating(p_rating numeric)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_rating is null or p_rating < 0.5 or p_rating > 5 or (p_rating * 2) <> floor(p_rating * 2) then
    raise exception 'invalid rating';
  end if;
  insert into public.site_ratings (user_id, rating) values (v_uid, p_rating)
  on conflict (user_id) do update set rating = excluded.rating, updated_at = now();
end;
$$;

create or replace function public.get_my_site_rating()
returns numeric
language sql
security definer
set search_path = public
as $$
  select rating from public.site_ratings where user_id = auth.uid();
$$;

create or replace function public.delete_my_site_rating()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.site_ratings where user_id = auth.uid();
$$;

create or replace function public.site_rating_stats()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object('avg', coalesce(round(avg(rating)::numeric, 1), 0), 'count', count(*)) from public.site_ratings;
$$;

revoke all on function public.submit_site_rating(numeric) from public, anon;
revoke all on function public.get_my_site_rating() from public, anon;
revoke all on function public.delete_my_site_rating() from public, anon;
revoke all on function public.site_rating_stats() from public, anon;
grant execute on function public.submit_site_rating(numeric) to authenticated;
grant execute on function public.get_my_site_rating() to authenticated;
grant execute on function public.delete_my_site_rating() to authenticated;
grant execute on function public.site_rating_stats() to authenticated;
