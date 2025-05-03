-- 1. activities テーブル作成
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  action text not null,
  target text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. RLS 有効化
alter table activities enable row level security;

-- 3. 自分のログだけ SELECT できるように
create policy "Users can view their own activities"
on activities
for select
using (auth.uid() = user_id);

-- 4. 自分のログだけ INSERT できるように
create policy "Users can insert their own activities"
on activities
for insert
with check (auth.uid() = user_id);