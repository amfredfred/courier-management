"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadAttachment(shipmentId: string, formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file) return { error: "No file provided" };

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) return { error: "File too large (max 10MB)" };

  const ext = file.name.split(".").pop();
  const fileName = `${shipmentId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("shipment-attachments")
    .upload(fileName, file);

  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabase.storage
    .from("shipment-attachments")
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase.from("attachments").insert({
    shipment_id: shipmentId,
    file_name: file.name,
    file_url: urlData.publicUrl,
    file_type: file.type,
    file_size: file.size,
  });

  if (dbError) return { error: dbError.message };

  revalidatePath(`/dashboard/shipments/${shipmentId}`);
  return { success: true, url: urlData.publicUrl };
}

export async function deleteAttachment(attachmentId: string, fileUrl: string, shipmentId: string) {
  const supabase = await createClient();

  // Extract path from URL
  const url = new URL(fileUrl);
  const pathParts = url.pathname.split("/shipment-attachments/");
  if (pathParts[1]) {
    await supabase.storage.from("shipment-attachments").remove([pathParts[1]]);
  }

  const { error } = await supabase.from("attachments").delete().eq("id", attachmentId);
  if (error) return { error: error.message };

  revalidatePath(`/dashboard/shipments/${shipmentId}`);
  return { success: true };
}
