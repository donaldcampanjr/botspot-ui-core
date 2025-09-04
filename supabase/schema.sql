-- Create user_roles table if not exists
create table if not exists public.user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'Daily User',
  assigned_at timestamptz default now(),
  primary key(user_id)
);

-- Optional columns on auth.users for email verification state (if permitted)
alter table auth.users
  add column if not exists email_verified boolean default false,
  add column if not exists verification_token text;
