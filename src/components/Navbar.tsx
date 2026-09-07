'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  ChevronDown 
} from 'lucide-react';

const ROLES = [
  { id: 'citizen', name: 'Citizen / Panchayat Sachiv', icon: UserCheck, badge: 'e-Pramaan Sandbox' },
  { id: 'researcher', name: 'University Lab Head', icon: Building2, badge: 'AISHE Verified' },
  { id: 'admin', name: 'State Triage Officer', icon: ShieldCheck, badge: 'Govt Authorized' }
];

export default function Navbar() {
  const pathname = usePathname();
  const [selectedRole, setSelectedRole] = useState(ROLES[2]);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      {/* Official Government Top Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-200">State Innovation Council — Civic R&D Clearinghouse</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">Govt. of Jharkhand Sandbox Tier-1</span>
        </div>

        {/* Dynamic Simulated Identity Badge */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden md:inline">Simulated Identity:</span>
          <div className="relative group">
            <button className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold border border-slate-700 cursor-pointer">
              <selectedRole.icon className="w-3 h-3 text-emerald-400" />
              <span>{selectedRole.name}</span>
              <span className="bg-emerald-950 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded border border-emerald-800">
                {selectedRole.badge}
              </span>
              <ChevronDown className="w-2.5 h-2.5 ml-1 text-slate-400" />
            </button>
            <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 hidden group-hover:block z-50">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Switch Evaluator Role
              </div>
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                    selectedRole.id === r.id ? 'bg-slate-50 text-emerald-700 font-bold' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <r.icon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{r.name}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 border border-slate-200 px-1 rounded">{r.badge}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-base shadow-sm">
            अ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">Anveshan</span>
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300">
                JHARKHAND R&D
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-none">Civic Problem & Innovation Bridge</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            href="/challenges"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              pathname === '/challenges' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Explore Challenges
          </Link>
          <Link
            href="/report"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              pathname === '/report' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Report Problem
          </Link>
          <Link
            href="/admin"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              pathname === '/admin' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Portal</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}