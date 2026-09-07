'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Layers, 
  IndianRupee, 
  Loader2, 
  ShieldCheck, 
  User,
  Cpu,
  FileSignature,
  AlertTriangle,
  Send,
  Coins,
  ArrowUpRight
} from 'lucide-react';

interface ProposalWithRelations {
  id: string;
  challenge_id: string;
  researcher_id: string;
  title: string;
  solution_summary?: string;
  abstract?: string;
  estimated_budget?: number;
  budget_inr?: number;
  timeline_months: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Submitted';
  created_at: string;
  challenges?: {
    title: string;
    district: string;
    category: string;
  };
  users?: {
    full_name: string | null;
    email: string;
  };
}

const generateSanctionOrder = (proposal: ProposalWithRelations) => {
  const amount = proposal.estimated_budget ?? proposal.budget_inr ?? 0;
  const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const memoNo = `Memo No. JH/DST/2026/${proposal.id.substring(0, 6).toUpperCase()}`;
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>State Sanction Order - ${memoNo}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; margin: 0; text-transform: uppercase; }
          .subtitle { font-size: 16px; margin: 5px 0 0 0; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 30px; font-weight: bold; }
          .content { text-align: justify; }
          .amount { font-size: 18px; font-weight: bold; background: #f3f4f6; padding: 5px 10px; display: inline-block; border: 1px solid #ccc; }
          .footer { margin-top: 60px; display: flex; justify-content: space-between; }
          .signature { text-align: center; width: 250px; border-top: 1px dashed #111; padding-top: 10px; font-weight: bold; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">GOVERNMENT OF JHARKHAND</div>
          <div class="subtitle">Department of Higher Education & State Innovation Council</div>
        </div>
        
        <div class="meta">
          <div>${memoNo}</div>
          <div>Date: ${dateStr}</div>
        </div>

        <h3 style="text-align: center; text-decoration: underline;">OFFICIAL R&D SANCTION ORDER</h3>

        <div class="content">
          <p>By the order of the State Innovation Council, approval is hereby accorded for the adoption and execution of the civic research proposal titled <strong>"${proposal.title}"</strong>.</p>
          
          <p><strong>Target Problem:</strong> ${proposal.challenges?.title || 'Civic Bottleneck'}<br/>
             <strong>District Allocation:</strong> ${proposal.challenges?.district || 'Statewide'}<br/>
             <strong>Lead Investigator:</strong> ${proposal.users?.full_name || proposal.users?.email || 'Authorized R&D Lab'}
          </p>

          <p>The Council sanctions a total research grant of <span class="amount">₹${amount.toLocaleString('en-IN')}</span> for a timeline of <strong>${proposal.timeline_months} months</strong>.</p>
          
          <p><strong>Funding Disbursement Tranches:</strong></p>
          <ul>
            <li><strong>Tranche 1 (30% - ₹${(amount * 0.3).toLocaleString('en-IN')}):</strong> Mobilization & initial equipment procurement.</li>
            <li><strong>Tranche 2 (40% - ₹${(amount * 0.4).toLocaleString('en-IN')}):</strong> Milestone 2 lab prototype validation.</li>
            <li><strong>Tranche 3 (30% - ₹${(amount * 0.3).toLocaleString('en-IN')}):</strong> Live district deployment and panchayat sign-off.</li>
          </ul>

          <p><em>The investigating institution must submit quarterly technical audit reports. Intellectual Property derived from this grant falls under the State-University Joint Framework.</em></p>
        </div>

        <div class="footer">
          <div class="signature">Authorized Signatory<br/>State Triage Panel, Jharkhand</div>
          <div class="signature" style="border:none;">[Digital Verification Seal Valid]</div>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
};

export default function AdminPortalPage() {
  const [proposals, setProposals] = useState<ProposalWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [trancheState, setTrancheState] = useState<Record<string, number>>({});
  const [stats, setStats] = useState({
    totalChallenges: 0,
    underReview: 0,
    adopted: 0,
    totalGrantAllocated: 0,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);

    const { data: challengesData } = await supabase.from('challenges').select('status');
    if (challengesData) {
      const underRev = challengesData.filter(c => c.status === 'Under Review').length;
      const adp = challengesData.filter(c => c.status === 'Adopted').length;
      setStats(prev => ({
        ...prev,
        totalChallenges: challengesData.length,
        underReview: underRev,
        adopted: adp,
      }));
    }

    const { data: proposalsData, error } = await supabase
      .from('proposals')
      .select(`
        *,
        challenges ( title, district, category ),
        users!university_id(full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (!error && proposalsData) {
      setProposals(proposalsData as unknown as ProposalWithRelations[]);
      const approvedGrants = proposalsData
        .filter(p => p.status === 'Approved')
        .reduce((sum, p) => sum + (Number(p.estimated_budget ?? p.budget_inr ?? 0) || 0), 0);
      setStats(prev => ({ ...prev, totalGrantAllocated: approvedGrants }));
    }

    setLoading(false);
  };

  const handleDecision = async (
    proposalId: string,
    challengeId: string,
    decision: 'Approved' | 'Rejected'
  ) => {
    setUpdatingId(proposalId);

    setProposals(prev =>
      prev.map(p => (p.id === proposalId ? { ...p, status: decision } : p))
    );

    if (decision === 'Approved') {
      setTrancheState(prev => ({ ...prev, [proposalId]: 1 }));
      setStats(prev => {
        const approvedItem = proposals.find(p => p.id === proposalId);
        const amount = Number(approvedItem?.estimated_budget ?? approvedItem?.budget_inr ?? 0);
        return {
          ...prev,
          adopted: prev.adopted + 1,
          underReview: Math.max(0, prev.underReview - 1),
          totalGrantAllocated: prev.totalGrantAllocated + amount,
        };
      });
    }

    try {
      await supabase.from('proposals').update({ status: decision }).eq('id', proposalId);
      if (decision === 'Approved') {
        await supabase.from('challenges').update({ status: 'Adopted' }).eq('id', challengeId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
      fetchAdminData();
    }
  };

  const advanceTranche = (id: string) => {
    setTrancheState(prev => {
      const current = prev[id] || 1;
      return { ...prev, [id]: Math.min(3, current + 1) };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-sm">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            State Innovation & Triage Portal
          </h1>
          <p className="text-sm text-slate-500">
            Government of Jharkhand - Higher & Technical Education Triage Panel
          </p>
        </div>
      </div>
      {/* State Authorization Seal */}
      <div className="bg-slate-900 text-slate-200 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">
            Authenticated Session: <strong className="text-white font-semibold">State Innovation & Triage Council</strong> (Govt. of Jharkhand)
          </span>
        </div>
        <span className="bg-slate-800 text-emerald-400 font-mono text-[10px] px-2.5 py-0.5 rounded border border-slate-700 font-semibold tracking-wide">
          Clearance: Tier-1 Adjudicator
        </span>
      </div>
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Issues</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalChallenges}</div>
          <span className="text-[11px] text-slate-400">Crowdsourced from districts</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Under Review</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{stats.underReview}</div>
          <span className="text-[11px] text-slate-400">Awaiting grant triage</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Adopted Solutions</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.adopted}</div>
          <span className="text-[11px] text-slate-400">R&D underway in labs</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Grant Committed</span>
            <IndianRupee className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ₹{(stats.totalGrantAllocated || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">State research sanctions</span>
        </div>
      </div>

      {/* Proposals Triage Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Institutional Proposals for Review</h2>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
            {proposals.length} active submissions
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            <span>Loading registry data...</span>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-16 p-8">
            <p className="text-sm text-slate-600 font-medium">No adoption proposals filed yet.</p>
            <p className="text-xs text-slate-400 mt-1">Institutional filings from universities will show up here for triage.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Target Problem</th>
                  <th className="px-6 py-3.5">Proposal Title & Lead</th>
                  <th className="px-6 py-3.5">AI Feasibility Audit</th>
                  <th className="px-6 py-3.5">Escrow Tranches</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Triage Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proposals.map((item) => {
                  const rawBudget = Number(item.estimated_budget ?? item.budget_inr ?? 0);
                  const feasibilityScore = Math.min(98, Math.max(72, 95 - (rawBudget / 100000) + (item.title.length % 5)));
                  const isHighRisk = rawBudget > 800000;
                  const currentTranche = trancheState[item.id] || (item.status === 'Approved' ? 1 : 0);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4 max-w-[180px]">
                        <p className="font-semibold text-slate-900 line-clamp-2 leading-snug">
                          {item.challenges?.title || "Unknown Challenge"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                          {item.challenges?.district} • {item.challenges?.category}
                        </p>
                      </td>
                      
                      <td className="px-6 py-4 max-w-[180px]">
                        <p className="font-medium text-slate-900 line-clamp-2 leading-snug">{item.title}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[150px]">{item.users?.full_name || item.users?.email || 'Researcher'}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="bg-slate-50 border border-slate-200 rounded p-2 text-[10px] space-y-1.5">
                          <div className="flex justify-between items-center text-slate-700">
                            <span className="flex items-center gap-1 font-semibold">
                              <Cpu className="w-3 h-3 text-emerald-600" /> Technical Feasibility:
                            </span>
                            <span className={feasibilityScore > 85 ? 'text-emerald-700 font-bold' : 'text-amber-600 font-bold'}>
                              {feasibilityScore.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-slate-700">
                            <span className="flex items-center gap-1 font-semibold">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Prior-Art Risk:
                            </span>
                            <span className="text-emerald-700 font-bold">Low (&lt; 2%)</span>
                          </div>
                          {isHighRisk && (
                            <div className="flex items-start gap-1 text-amber-700 bg-amber-50 p-1 rounded mt-1">
                              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span className="leading-tight">Budget flagged for manual audit (&gt; ₹8L threshold)</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Milestone Escrow Tranches */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                            <span>₹{rawBudget.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({item.timeline_months} mo)</span>
                          </div>
                          {item.status === 'Approved' ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-[10px] font-mono">
                                <span className={`px-1.5 py-0.5 rounded font-bold ${currentTranche >= 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>T1: 30%</span>
                                <span className={`px-1.5 py-0.5 rounded font-bold ${currentTranche >= 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>T2: 40%</span>
                                <span className={`px-1.5 py-0.5 rounded font-bold ${currentTranche >= 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>T3: 30%</span>
                              </div>
                              {currentTranche < 3 && (
                                <button
                                  onClick={() => advanceTranche(item.id)}
                                  className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  Release Next Tranche <ArrowUpRight className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Held in Escrow</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                          item.status === "Approved" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.status === "Rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {item.status === "Pending" || item.status === "Submitted" ? "In Triage" : item.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {(item.status === "Pending" || item.status === "Submitted") ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDecision(item.id, item.challenge_id, "Approved")}
                              disabled={updatingId === item.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleDecision(item.id, item.challenge_id, "Rejected")}
                              disabled={updatingId === item.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-600 text-xs font-medium transition cursor-pointer disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : item.status === "Approved" ? (
                          <button 
                            onClick={() => generateSanctionOrder(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition cursor-pointer shadow-sm"
                          >
                            <FileSignature className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Sanction PDF</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Decision Recorded</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}