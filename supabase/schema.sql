create extension if not exists "uuid-ossp";

create type public.language_mode as enum ('english', 'hinglish', 'mixed');
create type public.memory_visibility as enum ('private', 'assistant_only', 'shared');
create type public.memory_category as enum (
  'personal_goals',
  'relationship_issues',
  'study_stress',
  'habits',
  'recurring_fears',
  'breakthroughs',
  'milestones',
  'emotional_triggers'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  preferred_name text not null,
  goals text[] not null default '{}',
  stress_areas text[] not null default '{}',
  relationship_status text,
  exam_career_pressure text,
  preferred_language public.language_mode not null default 'english',
  comfort_style text,
  support_depth integer not null default 50 check (support_depth between 1 and 100),
  communication_preference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  pinned boolean not null default false,
  last_message_preview text,
  tone_badge text,
  language_badge public.language_mode default 'english',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('system', 'user', 'assistant')),
  content text not null,
  tone_style text,
  language public.language_mode default 'english',
  created_at timestamptz not null default now()
);

create table if not exists public.memories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category public.memory_category not null,
  summary text not null,
  confidence numeric(3,2) not null default 0.50,
  pinned boolean not null default false,
  visibility public.memory_visibility not null default 'assistant_only',
  source_conversation_id uuid references public.conversations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.check_ins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  check_in_date date not null,
  stress integer not null check (stress between 0 and 100),
  confidence integer not null check (confidence between 0 and 100),
  focus integer not null check (focus between 0 and 100),
  sleep integer not null check (sleep between 0 and 100),
  overthinking integer not null check (overthinking between 0 and 100),
  relationship_energy integer not null check (relationship_energy between 0 and 100),
  academic_pressure integer not null check (academic_pressure between 0 and 100),
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, check_in_date)
);

create table if not exists public.reply_assist_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_text text not null,
  mature_reply text,
  soft_reply text,
  confident_reply text,
  emotionally_intelligent_reply text,
  no_reply_suggestion text,
  red_flag_warning text,
  created_at timestamptz not null default now()
);

create table if not exists public.voice_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  transcript text,
  audio_url text,
  duration_seconds integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete set null,
  event_name text not null,
  feature text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.memories enable row level security;
alter table public.check_ins enable row level security;
alter table public.reply_assist_requests enable row level security;
alter table public.voice_sessions enable row level security;
alter table public.analytics_events enable row level security;

create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage own conversations" on public.conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own messages" on public.messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own memories" on public.memories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own check-ins" on public.check_ins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own reply assist requests" on public.reply_assist_requests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own voice sessions" on public.voice_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own analytics events" on public.analytics_events
  for select using (auth.uid() = user_id);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.handle_updated_at();

create trigger conversations_updated_at before update on public.conversations
for each row execute function public.handle_updated_at();

create trigger memories_updated_at before update on public.memories
for each row execute function public.handle_updated_at();
