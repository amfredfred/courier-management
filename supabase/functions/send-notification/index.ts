import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  failed_delivery: "Failed Delivery",
  returned: "Returned",
  cancelled: "Cancelled",
};

serve(async (req) => {
  try {
    const { shipment_id, status, location, description } = await req.json();
    if (!shipment_id || !status) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: shipment, error } = await supabase
      .from("shipments")
      .select("*")
      .eq("id", shipment_id)
      .single();

    if (error || !shipment) {
      return new Response(JSON.stringify({ error: "Shipment not found" }), { status: 404 });
    }

    const statusLabel = STATUS_LABELS[status] ?? status;
    const appUrl = Deno.env.get("APP_URL") ?? "http://localhost:3000";

    const emailBody = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
        <div style="background: #0f172a; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #f5a800; margin: 0; font-size: 20px;">📦 Shipment Update</h1>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; padding: 28px; border-radius: 0 0 12px 12px;">
          <p style="margin: 0 0 20px;">Hi <strong>${shipment.receiver_name}</strong>,</p>
          <p>Your shipment <strong>${shipment.tracking_id}</strong> status has been updated to:</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #f5a800; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold;">${statusLabel}</p>
            ${location ? `<p style="margin: 6px 0 0; color: #6b7280; font-size: 14px;">📍 ${location}</p>` : ""}
            ${description ? `<p style="margin: 6px 0 0; color: #6b7280; font-size: 14px;">${description}</p>` : ""}
          </div>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #6b7280; width: 140px;">From</td><td style="padding: 8px 0; font-weight: 500;">${shipment.sender_name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">To</td><td style="padding: 8px 0; font-weight: 500;">${shipment.receiver_name}</td></tr>
            ${shipment.estimated_delivery ? `<tr><td style="padding: 8px 0; color: #6b7280;">Est. Delivery</td><td style="padding: 8px 0; font-weight: 500;">${shipment.estimated_delivery}</td></tr>` : ""}
          </table>
          <a href="${appUrl}/track?id=${shipment.tracking_id}" style="display: inline-block; background: #f5a800; color: #0f172a; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">
            Track Your Shipment →
          </a>
          <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af;">
            This is an automated notification from CourierMS. Do not reply to this email.
          </p>
        </div>
      </div>
    `;

    // Send to receiver
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CourierMS <notifications@yourdomain.com>",
        to: shipment.receiver_email,
        subject: `Shipment ${shipment.tracking_id}: ${statusLabel}`,
        html: emailBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: "Email failed", details: err }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
