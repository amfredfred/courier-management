import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Cron: runs weekly on Sunday at 02:00 UTC — "0 2 * * 0"
serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Remove cancelled shipments older than 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: oldCancelled, error } = await supabase
    .from("shipments")
    .delete()
    .eq("status", "cancelled")
    .lt("updated_at", ninetyDaysAgo.toISOString())
    .select("id");

  return new Response(
    JSON.stringify({
      success: true,
      deleted_cancelled: oldCancelled?.length ?? 0,
      ran_at: new Date().toISOString(),
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
