import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeskClient from "./ui";

export default async function DeskPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let { data: profile } = await supabase.from("lintel_profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) {
    const handle = "hand" + user.id.slice(0, 6);
    await supabase.from("lintel_profiles").insert({ id: user.id, handle, display_name: "New hand" });
    profile = { id: user.id, handle, display_name: "New hand" };
  }

  const { data: slips } = await supabase
    .from("lintel_slips")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  return <DeskClient profile={profile} slips={slips || []} />;
}
