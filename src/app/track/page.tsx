import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function TrackPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const id = params.id;
  if (id) redirect(`/?track=${id}`);
  else redirect("/");
}
