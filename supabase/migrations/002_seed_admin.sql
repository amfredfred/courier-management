-- =============================================
-- Run this AFTER creating your admin user via
-- Supabase Dashboard > Authentication > Users
-- Replace the email below with your admin email
-- =============================================

-- Optional: verify admin user exists
-- select id, email from auth.users where email = 'admin@yourcompany.com';

-- Optional: add a profile or metadata tag to admin users
-- alter table auth.users add column if not exists is_admin boolean default false;
-- update auth.users set is_admin = true where email = 'admin@yourcompany.com';

-- Additional performance indexes
create index if not exists shipments_updated_at_idx on shipments(updated_at desc);
create index if not exists shipments_estimated_delivery_idx on shipments(estimated_delivery);
create index if not exists tracking_events_status_idx on tracking_events(status);
