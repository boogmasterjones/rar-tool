import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rank & Rent Target Tracker",
  description: "Personal niche/city target dataset for rank-and-rent site planning",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-slate-900 text-white sticky top-0 z-10 shadow">
            <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/" className="font-semibold text-lg whitespace-nowrap">
                Rank &amp; Rent Targets
              </Link>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <Link href="/" className="hover:text-slate-300">Dataset</Link>
                <Link href="/listings/new" className="hover:text-slate-300">Add Listing</Link>
                <Link href="/import" className="hover:text-slate-300">Bulk Import</Link>
                <Link href="/playbook" className="hover:text-slate-300">Playbook</Link>
                <Link href="/methodology" className="hover:text-slate-300">Methodology</Link>
              </div>
            </nav>
          </header>
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">{children}</main>
          <footer className="text-center text-xs text-slate-400 py-6">
            Personal reference tool — not a public site.
          </footer>
        </div>
      </body>
    </html>
  );
}
