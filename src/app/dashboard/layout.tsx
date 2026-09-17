import { Sidebar } from "@/components/dashboard/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f7f5]">
      <Sidebar userEmail={user.email} />
      <main className="flex-1 min-w-0 h-full overflow-y-auto">{children}</main>
    </div>
  );
}
