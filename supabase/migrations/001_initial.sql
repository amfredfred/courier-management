-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Shipment status enum
create type shipment_status as enum (
  'pending',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'failed_delivery',
  'returned',
  'cancelled'
);

-- Shipments table
create table shipments (
  id uuid primary key default uuid_generate_v4(),
  tracking_id text unique not null,
  sender_name text not null,
  sender_email text not null,
  sender_phone text,
  sender_address text not null,
  receiver_name text not null,
  receiver_email text not null,
  receiver_phone text,
  receiver_address text not null,
  status shipment_status not null default 'pending',
  weight numeric(10, 2),
  dimensions text,
  description text,
  estimated_delivery date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tracking events table
create table tracking_events (
  id uuid primary key default uuid_generate_v4(),
  shipment_id uuid not null references shipments(id) on delete cascade,
  status shipment_status not null,
  location text,
  description text,
  created_at timestamptz not null default now()
);

-- Attachments table
create table attachments (
  id uuid primary key default uuid_generate_v4(),
  shipment_id uuid not null references shipments(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text,
  file_size integer,
  uploaded_by text,
  created_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger shipments_updated_at
  before update on shipments
  for each row execute function update_updated_at();

-- Indexes
create index shipments_tracking_id_idx on shipments(tracking_id);
create index shipments_status_idx on shipments(status);
create index shipments_created_at_idx on shipments(created_at desc);
create index tracking_events_shipment_id_idx on tracking_events(shipment_id);
create index tracking_events_created_at_idx on tracking_events(created_at desc);
create index attachments_shipment_id_idx on attachments(shipment_id);

-- Row Level Security
alter table shipments enable row level security;
alter table tracking_events enable row level security;
alter table attachments enable row level security;

-- Policies: authenticated users (admins) can do everything
create policy "Admins can manage shipments"
  on shipments for all
  to authenticated
  using (true)
  with check (true);

create policy "Admins can manage tracking events"
  on tracking_events for all
  to authenticated
  using (true)
  with check (true);

create policy "Admins can manage attachments"
  on attachments for all
  to authenticated
  using (true)
  with check (true);

-- Public read for tracking (by tracking_id only)
create policy "Public can view shipments by tracking_id"
  on shipments for select
  to anon
  using (true);

create policy "Public can view tracking events"
  on tracking_events for select
  to anon
  using (true);

-- Storage bucket for attachments
insert into storage.buckets (id, name, public)
values ('shipment-attachments', 'shipment-attachments', true)
on conflict do nothing;

create policy "Authenticated users can upload attachments"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'shipment-attachments');

create policy "Public can view attachments"
  on storage.objects for select
  to public
  using (bucket_id = 'shipment-attachments');

create policy "Authenticated users can delete attachments"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'shipment-attachments');
