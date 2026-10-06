-- MKY Global Forwarding: Phase 1 database schema (Supabase / Postgres)
-- Run in the Supabase SQL editor once. The website writes with the service role key (server only),
-- so Row Level Security is on with no public policies: nobody can read these tables from a browser.

create table if not exists public.quotes (
  id             bigint generated always as identity primary key,
  created_at     timestamptz not null default now(),
  reference      text not null unique,              -- MKY-Q-YYMMDD-XXXX
  channel        text not null check (channel in ('email', 'whatsapp')),
  status         text not null default 'new' check (status in ('new', 'in_progress', 'quoted', 'won', 'lost')),
  mode           text not null check (mode in ('vehicle', 'cargo', 'road', 'documents')),
  origin         text not null,
  destination    text not null,
  ready_date     date,
  collection     boolean not null default false,
  documents      text[] not null default '{}',      -- mrn, eur1, acid, other
  incoterm       text,
  vehicle_type   text,
  vehicle_count  integer,
  make_model     text,
  vins           text,
  running        boolean,
  goods          text,
  pieces         integer,
  weight_kg      numeric,
  dims_cm        text,
  dangerous      boolean not null default false,
  name           text not null,
  company        text,
  email          text not null,
  phone          text,
  notes          text
);

create index if not exists quotes_created_at_idx on public.quotes (created_at desc);
create index if not exists quotes_destination_idx on public.quotes (destination);

create table if not exists public.events (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  type        text not null,                        -- track_search
  query       text not null,
  found       boolean not null,
  reason      text
);

create index if not exists events_created_at_idx on public.events (created_at desc);

alter table public.quotes enable row level security;
alter table public.events enable row level security;

-- Handy views for reporting (Aakash): weekly volume and top lanes
create or replace view public.quotes_weekly as
  select date_trunc('week', created_at) as week, mode, count(*) as requests
  from public.quotes group by 1, 2 order by 1 desc, 2;

create or replace view public.quotes_by_lane as
  select origin, destination, count(*) as requests
  from public.quotes group by 1, 2 order by 3 desc;
