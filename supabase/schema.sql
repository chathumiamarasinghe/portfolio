create table if not exists public.portfolio_stats (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null,
  label text not null,
  icon text not null,
  updated_at timestamptz not null default now()
);

insert into public.portfolio_stats (key, value, label, icon)
values
  ('rating', '4.9', 'Rating', 'Star'),
  ('projects', '150+', 'Projects', 'Folder'),
  ('comments', '1.2k', 'Comments', 'MessageCircle'),
  ('experience', '3+', 'Experience', 'BarChart3'),
  ('linkedin_comments', '1.2k', 'Comments', 'MessageCircle'),
  ('experience_years', '3+', 'Experience', 'BarChart3')
on conflict (key) do nothing;

alter table public.portfolio_stats enable row level security;

create policy "Public can read stats"
  on public.portfolio_stats
  for select
  to anon, authenticated
  using (true);
