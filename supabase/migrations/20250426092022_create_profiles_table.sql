-- create_profiles_table.sql

create table profiles (
  id uuid references auth.users on delete cascade,
  name text,
  email text unique,
  primary key(id)
);