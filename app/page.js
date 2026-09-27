import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function Home() {
  const supabase = createClient();
  const [{ data: hours }, { data: slips }] = await Promise.all([
    supabase.from("lintel_hours").select("*").order("hour_mark", { ascending: false }).limit(1),
    supabase.from("lintel_slips").select("id,title,body,created_at,lintel_profiles(handle,display_name)").eq("is_public", true).order("created_at", { ascending: false }).limit(40),
  ]);
  const hour = hours?.[0];

  return (
    <main>
      <section className="hero">
        <h1>What you mark public<br />lands on the wall.</h1>
        <p>Private slips stay at the desk. The hour note changes as the site is tended. Nothing here is meant to look generated.</p>
      </section>

      {hour && (
        <article className="hour">
          <small>This hour · {new Date(hour.hour_mark).toUTCString().slice(0, 22)}</small>
          <h2>{hour.title}</h2>
          <p>{hour.body}</p>
        </article>
      )}

      <div className="grid">
        {(slips || []).length === 0 && <p className="meta">The wall is empty. Write something at the desk and mark it public.</p>}
        {(slips || []).map((s, i) => (
          <article className="slip" key={s.id} style={{ animationDelay: `${0.04 * i}s` }}>
            {s.title ? <h3>{s.title}</h3> : null}
            <p>{s.body}</p>
            <div className="meta">
              {(s.lintel_profiles?.display_name || s.lintel_profiles?.handle || "anon")} · {new Date(s.created_at).toLocaleString()}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
