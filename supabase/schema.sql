create table if not exists test_submissions (
  id uuid primary key default gen_random_uuid(),
  survey_id text not null default 'cbti',
  visitor_hash text not null,
  primary_persona text not null,
  scores jsonb not null,
  answers jsonb not null,
  user_agent_hash text,
  created_at timestamptz not null default now()
);

alter table test_submissions add column if not exists survey_id text not null default 'cbti';

create index if not exists test_submissions_created_at_idx on test_submissions (created_at);
create index if not exists test_submissions_survey_id_idx on test_submissions (survey_id);
create index if not exists test_submissions_primary_persona_idx on test_submissions (primary_persona);
create index if not exists test_submissions_visitor_hash_idx on test_submissions (visitor_hash);

create table if not exists site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_hash text not null,
  path text not null,
  user_agent_hash text,
  created_at timestamptz not null default now()
);

create index if not exists site_visits_created_at_idx on site_visits (created_at);
create index if not exists site_visits_visitor_hash_idx on site_visits (visitor_hash);
