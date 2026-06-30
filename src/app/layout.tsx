import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import ResetButton from "@/components/ResetButton";
import StoreHydration from "@/components/StoreHydration";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 Simulator",
  description: "Simulate the FIFA World Cup 2026 — group stage, bracket & AI analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <nav className="border-b border-[#1F2937] bg-[#0B1120]/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src="/wc2026-logo.png" alt="FIFA World Cup 2026" width={36} height={36} className="object-contain" />
              <div>
                <span className="font-display font-bold text-[#F9FAFB] text-lg leading-none block">WC 2026</span>
                <span className="text-[10px] text-[#00FF85] uppercase tracking-widest">Simulator</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-[#6B7280] hover:text-[#F9FAFB] transition-colors">Groups</Link>
              <Link href="/bracket" className="text-sm text-[#6B7280] hover:text-[#F9FAFB] transition-colors">Bracket</Link>
              <ResetButton />
            </div>
          </div>
        </nav>
        <StoreHydration />
        <main>{children}</main>
        <footer className="border-t border-[#1F2937] mt-10 py-4 text-center text-xs text-[#6B7280]">
          © Copyright SanchoDev 2026
        </footer>
      </body>
    </html>
  );
}
