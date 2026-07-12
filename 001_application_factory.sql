create extension if not exists pgcrypto;
create table if not exists public.projects(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,idea text not null,languages text,status text not null default 'draft' check(status in ('draft','analyzed','validated','generating','testing','published','failed')),specification jsonb not null default '{}'::jsonb,github_repository_url text,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
alter table public.projects enable row level security;
revoke all on public.projects from anon,authenticated;
create or replace function public.set_updated_at() returns trigger language plpgsql as $$begin new.updated_at=now();return new;end$$;
drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
