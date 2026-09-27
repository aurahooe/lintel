import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Lintel",
  description: "A quiet board for slips that want a public life.",
};

export default async function RootLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <div className="wrap">
          <header className="site">
            <Link className="mark" href="/">Lintel</Link>
            <nav className="site">
              <Link href="/">Wall</Link>
              {user ? <Link href="/desk">Desk</Link> : <Link href="/login">Enter</Link>}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
