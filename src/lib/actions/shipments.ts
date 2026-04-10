"use server";

import { createClient } from "@/lib/supabase/server";
import { generateTrackingId } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Shipment, ShipmentStatus } from "@/types";

const ShipmentSchema = z.object({
  sender_name: z.string().min(1, "Required"),
  sender_email: z.string().email("Invalid email"),
  sender_phone: z.string().optional(),
  sender_address: z.string().min(1, "Required"),
  receiver_name: z.string().min(1, "Required"),
  receiver_email: z.string().email("Invalid email"),
  receiver_phone: z.string().optional(),
  receiver_address: z.string().min(1, "Required"),
  weight: z.coerce.number().positive().optional(),
  dimensions: z.string().optional(),
  description: z.string().optional(),
  estimated_delivery: z.string().optional(),
  notes: z.string().optional(),
});

export async function getShipments(filters?: {
  status?: ShipmentStatus;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const supabase = await createClient();
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;
  const from = (page - 1) * limit;

  let query = supabase
    .from("shipments")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.search) {
    query = query.or(
      `tracking_id.ilike.%${filters.search}%,sender_name.ilike.%${filters.search}%,receiver_name.ilike.%${filters.search}%,receiver_email.ilike.%${filters.search}%`
    );
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { shipments: data as Shipment[], total: count ?? 0 };
}

export async function getShipmentById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shipments")
    .select(`*, tracking_events(*), attachments(*)`)
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as Shipment;
}

export async function getShipmentByTrackingId(trackingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shipments")
    .select(`*, tracking_events(*)`)
    .eq("tracking_id", trackingId)
    .single();
  if (error) return null;
  return data as Shipment;
}

export async function createShipment(formData: FormData) {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());

  // Strip empty strings so optional fields stay undefined
  const cleaned = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== "")
  );

  const parsed = ShipmentSchema.safeParse(cleaned);
  if (!parsed.success) {
    return { error: "Invalid form data", details: parsed.error.flatten() };
  }

  const tracking_id = generateTrackingId();
  const { data: shipment, error } = await supabase
    .from("shipments")
    .insert({ ...parsed.data, tracking_id })
    .select()
    .single();

  if (error) return { error: error.message };

  await supabase.from("tracking_events").insert({
    shipment_id: shipment.id,
    status: "pending",
    description: "Shipment created and registered in the system",
  });

  revalidatePath("/dashboard/shipments");
  revalidatePath("/dashboard");
  return { shipment: shipment as Shipment };
}

export async function updateShipment(id: string, formData: FormData) {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());
  const cleaned = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== "")
  );
  const parsed = ShipmentSchema.partial().safeParse(cleaned);
  if (!parsed.success) return { error: "Invalid form data" };

  const { data, error } = await supabase
    .from("shipments")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/shipments");
  revalidatePath(`/dashboard/shipments/${id}`);
  return { shipment: data as Shipment };
}

export async function updateShipmentStatus(
  id: string,
  status: ShipmentStatus,
  location?: string,
  description?: string
) {
  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("shipments")
    .update({ status })
    .eq("id", id);

  if (updateError) return { error: updateError.message };

  const { error: eventError } = await supabase.from("tracking_events").insert({
    shipment_id: id,
    status,
    location,
    description: description || `Status updated to ${status.replace(/_/g, " ")}`,
  });

  if (eventError) return { error: eventError.message };

  revalidatePath("/dashboard/shipments");
  revalidatePath(`/dashboard/shipments/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateShipmentStatusWithNotification(
  id: string,
  status: ShipmentStatus,
  location?: string,
  description?: string,
  notify = true
) {
  const result = await updateShipmentStatus(id, status, location, description);
  if (result.error) return result;

  if (notify) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    fetch(`${appUrl}/api/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipment_id: id, status, location, description }),
    }).catch(() => {});
  }

  return { success: true };
}

export async function deleteShipment(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("shipments").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/shipments");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("shipments")
    .select("status, created_at");

  if (error) throw new Error(error.message);

  return {
    total: data.length,
    pending: data.filter((s) => s.status === "pending").length,
    in_transit: data.filter((s) =>
      ["in_transit", "picked_up", "out_for_delivery"].includes(s.status)
    ).length,
    delivered: data.filter((s) => s.status === "delivered").length,
    failed: data.filter((s) => s.status === "failed_delivery").length,
    today: data.filter((s) => s.created_at.startsWith(today)).length,
  };
}

export async function getShipmentsByMonth() {
  const supabase = await createClient();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data, error } = await supabase
    .from("shipments")
    .select("created_at, status")
    .gte("created_at", sixMonthsAgo.toISOString());

  if (error) return [];

  const grouped: Record<string, { month: string; total: number; delivered: number }> = {};
  data.forEach((s) => {
    const month = new Date(s.created_at).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    if (!grouped[month]) grouped[month] = { month, total: 0, delivered: 0 };
    grouped[month].total++;
    if (s.status === "delivered") grouped[month].delivered++;
  });

  return Object.values(grouped);
}

export async function exportShipmentsCSV(filters?: {
  status?: ShipmentStatus;
  search?: string;
}) {
  const { shipments } = await getShipments({ ...filters, limit: 10000 });

  const headers = [
    "Tracking ID", "Status", "Sender Name", "Sender Email", "Sender Phone",
    "Sender Address", "Receiver Name", "Receiver Email", "Receiver Phone",
    "Receiver Address", "Weight (kg)", "Dimensions", "Description",
    "Est. Delivery", "Notes", "Created At", "Updated At"
  ];

  const rows = shipments.map((s) => [
    s.tracking_id, s.status, s.sender_name, s.sender_email, s.sender_phone ?? "",
    s.sender_address, s.receiver_name, s.receiver_email, s.receiver_phone ?? "",
    s.receiver_address, s.weight ?? "", s.dimensions ?? "", s.description ?? "",
    s.estimated_delivery ?? "", s.notes ?? "", s.created_at, s.updated_at
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return csv;
}
