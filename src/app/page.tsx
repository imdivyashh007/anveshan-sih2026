import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  ArrowRight, 
  FlaskConical, 
  FileText, 
  MapPin, 
  Landmark, 
  TrendingUp, 
  Layers, 
  ChevronRight,
  Award,
  BookOpen,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  const [{ count: totalChallenges }, { data: approvedProposals }] = await Promise.all([
    supabase.from('challenges').select('*', { count: 'exact', head: true }),
    supabase.from('proposals').select('estimated_budget').eq('status', 'Approved')
  ]);

  const adoptedCount = approvedProposals ? approvedProposals.length : 0;
  const totalGrantSanctioned = approvedProposals
    ? approvedProposals.reduce((acc, curr) => acc + (Number(curr.estimated_budget) || 0), 0)
    : 0;

  const districtNodes = [
    { name: "Sahebganj", domain: "Water Quality (Arsenic Adsorption)", status: "Adopted", grant: "₹4,50,000", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    { name: "Dumka", domain: "Solar Microgrid Battery Decay", status: "Open for R&D", grant: "₹3,80,000", badge: "bg-amber-100 text-amber-800 border-amber-300" },
    { name: "West Singhbhum", domain: "Lac Post-Harvest Cold Chain", status: "Open for R&D", grant: "₹5,00,000", badge: "bg-blue-100 text-blue-800 border-blue-300" },
    { name: "Ranchi", domain: "Tomato Produce Spoilage Sensors", status: "Reported", grant: "₹2,50,000", badge: "bg-slate-100 text-slate-800 border-slate-300" }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between">
      
      {/* Tricolor Government Border Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 border-b border-slate-300" />

      {/* Sub-Header Official Banner */}
      <div className="bg-emerald-900 text-emerald-50 px-4 py-2 text-xs border-b border-emerald-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-emerald-700">
              State Portal
            </span>
            <span className="font-medium">
              Government of Jharkhand • Department of Higher & Technical Education
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200 text-[11px] font-mono">
            <span>State Innovation Council (SIC)</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Portal Live
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
        
        {/* Hero Section */}
        <section className="bg-white border border-slate-300 rounded-lg p-6 sm:p-10 shadow-sm">
          <div className="max-w-4xl space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded text-xs font-semibold text-emerald-900">
              <Landmark className="w-3.5 h-3.5 text-emerald-700" />
              Jharkhand Civic R&D Adoption Pipeline (Anveshan)
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Institutional R&D Grants for Grassroots Civic Challenges
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              An official state clearinghouse bridging chronic village and municipal engineering bottlenecks with technical university laboratories. Sanctioning research grants and monitoring prototype validation across all 24 districts of Jharkhand.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/challenges"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-sm transition-colors"
              >
                <FlaskConical className="w-4 h-4" />
                Explore & Adopt Problem Statements
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/report"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm shadow-sm transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                Report Civic Challenge (Citizens & Panchayats)
              </Link>

              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-600 font-medium text-sm transition-colors"
              >
                <Building2 className="w-4 h-4 text-slate-500" />
                State Triage Portal
              </Link>
            </div>
          </div>
        </section>

        {/* Executive KPI Summary Counters */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>Reported Civic Issues</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{totalChallenges || 0}</span>
              <span className="text-xs text-slate-500 font-medium">across 24 districts</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Crowdsourced from rural panchayats & municipal bodies</p>
          </div>

          <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-sm border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <span>Adopted Solutions (Active R&D)</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-700">{adoptedCount}</span>
              <span className="text-xs text-emerald-800 font-medium">in prototype stage</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Adopted by accredited university engineering faculties</p>
          </div>

          <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-sm border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>State Research Grants Sanctioned</span>
              <Landmark className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                ₹{totalGrantSanctioned.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-blue-700 font-medium">approved capital</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Committed seed funding for lab development & validation</p>
          </div>
        </section>

        {/* State Spatial Monitoring Table */}
        <section className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                Active District Innovation Clusters
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time regional problem statements under state monitoring
              </p>
            </div>
            <Link 
              href="/challenges" 
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              View Full Public Registry <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">District</th>
                  <th className="px-6 py-3">Technical Problem Domain</th>
                  <th className="px-6 py-3">Current Pipeline Status</th>
                  <th className="px-6 py-3 text-right">Sanctioned / Est. Grant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {districtNodes.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">{row.name}</td>
                    <td className="px-6 py-3.5 font-medium text-slate-800">{row.domain}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded border ${row.badge}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-bold text-slate-900">{row.grant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3-Stage Governance Workflow */}
        <section className="bg-white border border-slate-300 rounded-lg p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              State Civic Innovation Lifecycle (Standard Operating Procedure)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              How grassroots field issues transition from civic report to approved institutional research grants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded border border-slate-200 bg-slate-50">
              <div className="w-7 h-7 rounded bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-bold mb-3 border border-amber-300">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                Crowdsourced Ingestion
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Panchayats, citizens, or local administrations log recurring technical failures with ground location details and problem categorization.
              </p>
            </div>

            <div className="p-4 rounded border border-slate-200 bg-slate-50">
              <div className="w-7 h-7 rounded bg-blue-100 text-blue-900 flex items-center justify-center text-xs font-bold mb-3 border border-blue-300">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-blue-700" />
                Academic R&D Adoption
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accredited engineering colleges and university labs review open district challenges and submit formal technical proposals and milestone budgets.
              </p>
            </div>

            <div className="p-4 rounded border border-slate-200 bg-slate-50">
              <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-900 flex items-center justify-center text-xs font-bold mb-3 border border-emerald-300">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                State Triage & Grant Sanction
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The State R&D Review Panel triages proposals, awards research grant capital, and updates the public registry to active prototype status.
              </p>
            </div>
          </div>
        </section>

        {/* Why Anveshan vs Standard Grievance Cell */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
              Conventional Redressal (e.g. CPGRAMS / Jharsewa)
            </span>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                Limited to routine municipal maintenance (repairing potholes, streetlights).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                Tickets are closed with "no vendor available" when deep engineering innovation is required.
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-300 rounded-lg p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Anveshan Institutional Grant Model
            </span>
            <ul className="mt-3 space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                Converts chronic failures (arsenic aquifers, solar battery decay) into research problem statements.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                Connects directly to state R&D funding and engineering faculty prototyping.
              </li>
            </ul>
          </div>
        </section>

      </main>

      {/* Official Government Footer */}
      <footer className="border-t border-slate-300 bg-white py-6 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">
            Anveshan — State Civic Innovation & Academic R&D Grant Pipeline
          </p>
          <p>
            Department of Higher & Technical Education • Government of Jharkhand
          </p>
        </div>
      </footer>
    </div>
  );
}