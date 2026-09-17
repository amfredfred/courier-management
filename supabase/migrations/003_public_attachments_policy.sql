-- The public tracking page joins `attachments(*)` onto a shipment lookup
-- (getShipmentByTrackingId), but attachments has RLS enabled with no policy
-- granting the anon role read access — unlike shipments and tracking_events,
-- which already have one. Without this, uploaded photos never reach the
-- public tracking page: the join silently returns zero rows for `anon`.

create policy "Public can view attachments"
  on attachments for select
  to anon
  using (true);
