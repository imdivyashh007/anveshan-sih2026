"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Layers, 
  IndianRupee, 
  Loader2, 
  ShieldCheck,
  User
} from "lucide-react";

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
  status: "Pending" | "Approved" | "Rejected";
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

export default function AdminPortalPage() {
  const [proposals, setProposals] = useState<ProposalWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
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

    const { data: challengesData } = await supabase.from("challenges").select("status");
    if (challengesData) {
      const underRev = challengesData.filter((c) => c.status === "Under Review").length;
      const adp = challengesData.filter((c) => c.status === "Adopted").length;
      setStats((prev) => ({
        ...prev,
        totalChallenges: challengesData.length,
        underReview: underRev,
        adopted: adp,
      }));
    }

    const { data: proposalsData, error } = await supabase
      .from("proposals")
      .select(`
        *,
        challenges (
          title,
          district,
          category
        ),
        users!university_id(full_name, email)
      `)
      .order("created_at", { ascending: false });

    if (!error && proposalsData) {
      setProposals(proposalsData as unknown as ProposalWithRelations[]);
      const approvedGrants = proposalsData
        .filter((p) => p.status === "Approved")
        .reduce((sum, p) => sum + (Number(p.estimated_budget ?? p.budget_inr ?? 0) || 0), 0);
      setStats((prev) => ({ ...prev, totalGrantAllocated: approvedGrants }));
    }

    setLoading(false);
  };

  const handleDecision = async (
    proposalId: string,
    challengeId: string,
    decision: "Approved" | "Rejected"
  ) => {
    setUpdatingId(proposalId);

    // Optimistic UI update
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: decision } : p))
    );

    if (decision === "Approved") {
      setStats((prev) => {
        const approvedItem = proposals.find((p) => p.id === proposalId);
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
      const { error: pErr } = await supabase
        .from("proposals")
        .update({ status: decision })
        .eq("id", proposalId);

      if (pErr) console.error("Error updating proposal:", pErr);

      if (decision === "Approved") {
        const { error: cErr } = await supabase
          .from("challenges")
          .update({ status: "Adopted" })
          .eq("id", challengeId);
        if (cErr) console.error("Error updating challenge:", cErr);
      }
    } catch (err) {
      console.error("handleDecision error:", err);
    } finally {
      setUpdatingId(null);
      fetchAdminData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            State Innovation & Triage Portal
          </h1>
          <p className="text-sm text-slate-500">
            Government of Jharkhand — Department of Higher Education & R&D Review Panel
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Issues</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalChallenges}</div>
          <span className="text-[11px] text-slate-400">Crowdsourced from districts</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Under Review</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{stats.underReview}</div>
          <span className="text-[11px] text-slate-400">Awaiting grant triage</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Adopted Solutions</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.adopted}</div>
          <span className="text-[11px] text-slate-400">R&D underway in labs</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Grant Committed</span>
            <IndianRupee className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ₹{stats.totalGrantAllocated.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">State research sanctions</span>
        </div>
      </div>

      {/* Proposals Triage Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
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
            <p className="text-slate-600 font-medium">No adoption proposals filed yet.</p>
            <p className="text-xs text-slate-400 mt-1">Institutional filings from universities will show up here for triage.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Target Problem</th>
                  <th className="px-6 py-3.5">Proposal Title & Lead</th>
                  <th className="px-6 py-3.5">Solution Abstract</th>
                  <th className="px-6 py-3.5">Budget & Term</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Triage Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proposals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-semibold text-slate-900 line-clamp-1">
                        {item.challenges?.title || "Unknown Challenge"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.challenges?.district} • {item.challenges?.category}
                      </p>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-slate-900 line-clamp-1">{item.title}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{item.users?.full_name || item.users?.email || "Researcher"}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 max-w-sm">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.solution_summary || item.abstract || "No summary provided."}
                      </p>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-900">
                        ₹{(Number(item.estimated_budget ?? item.budget_inr) || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-slate-500">{item.timeline_months} Months</p>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          item.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.status === "Rejected"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.status}
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
                            <span>Approve Grant</span>
                          </button>
                          <button
                            onClick={() => handleDecision(item.id, item.challenge_id, "Rejected")}
                            disabled={updatingId === item.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-medium transition cursor-pointer disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Decision Recorded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
