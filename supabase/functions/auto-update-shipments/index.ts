import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Cron: runs daily at 08:00 UTC — "0 8 * * *"
serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  // Mark overdue in-transit shipments as failed
  const { data: overdueShipments } = await supabase
    .from("shipments")
    .select("id, tracking_id, estimated_delivery")
    .in("status", ["in_transit", "out_for_delivery"])
    .lt("estimated_delivery", new Date().toISOString().split("T")[0])
    .not("estimated_delivery", "is", null);

  let flaggedCount = 0;

  for (const shipment of overdueShipments ?? []) {
    // Add a tracking event note (don't auto-fail, just flag)
    const { data: lastEvent } = await supabase
      .from("tracking_events")
      .select("id, description")
      .eq("shipment_id", shipment.id)
      .ilike("description", "%overdue%")
      .maybeSingle();

    if (!lastEvent) {
      await supabase.from("tracking_events").insert({
        shipment_id: shipment.id,
        status: "in_transit",
        description: "⚠️ Shipment is overdue — estimated delivery date has passed",
      });
      flaggedCount++;
    }
  }

  // Cleanup: delete tracking events older than 1 year for delivered shipments (optional)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return new Response(
    JSON.stringify({
      success: true,
      flagged_overdue: flaggedCount,
      ran_at: new Date().toISOString(),
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
