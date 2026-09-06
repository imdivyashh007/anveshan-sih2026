"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, PlusCircle, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Explore Challenges", href: "/challenges", icon: Compass },
    { name: "Report Problem", href: "/report", icon: PlusCircle },
    { name: "Admin Portal", href: "/admin", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            अ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">Anveshan</span>
              <span className="text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                Jharkhand R&D
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Civic Problem & Innovation Bridge</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
