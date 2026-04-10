export type ShipmentStatus =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed_delivery"
  | "returned"
  | "cancelled";

export interface Shipment {
  id: string;
  tracking_id: string;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  sender_address: string;
  receiver_name: string;
  receiver_email: string;
  receiver_phone?: string;
  receiver_address: string;
  status: ShipmentStatus;
  weight?: number;
  dimensions?: string;
  description?: string;
  estimated_delivery?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  tracking_events?: TrackingEvent[];
  attachments?: Attachment[];
}

export interface TrackingEvent {
  id: string;
  shipment_id: string;
  status: ShipmentStatus;
  location?: string;
  description?: string;
  created_at: string;
}

export interface Attachment {
  id: string;
  shipment_id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  uploaded_by?: string;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  in_transit: number;
  delivered: number;
  failed: number;
  today: number;
}

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  pending: "Pending",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  failed_delivery: "Failed Delivery",
  returned: "Returned",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<ShipmentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  picked_up: "bg-blue-100 text-blue-800 border-blue-200",
  in_transit: "bg-indigo-100 text-indigo-800 border-indigo-200",
  out_for_delivery: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  failed_delivery: "bg-red-100 text-red-800 border-red-200",
  returned: "bg-orange-100 text-orange-800 border-orange-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
};
