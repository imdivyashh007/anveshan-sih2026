"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];

export default function AdoptChallengePage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loadingChallenge, setLoadingChallenge] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    solution_summary: "",
    estimated_budget: "",
    timeline_months: "6",
  });

  useEffect(() => {
    async function loadChallenge() {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", challengeId)
        .single();

      if (!error && data) {
        setChallenge(data as Challenge);
      }
      setLoadingChallenge(false);
    }
    if (challengeId) loadChallenge();
  }, [challengeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .limit(1)
        .single();

      if (userError || !userData) {
        throw new Error("No valid user profile found in database.");
      }

      const { error: proposalError } = await supabase.from("proposals").insert([
        {
          challenge_id: challengeId,
          university_id: userData.id,
          title: formData.title,
          solution_summary: formData.solution_summary,
          estimated_budget: Number(formData.estimated_budget) || 0,
          timeline_months: Number(formData.timeline_months) || 6,
        },
      ]);

      if (proposalError) throw proposalError;

      await supabase
        .from("challenges")
        .update({ status: "Under Review" })
        .eq("id", challengeId);

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit adoption proposal.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingChallenge) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
        <span>Loading challenge context...</span>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-slate-600 font-medium">Challenge not found.</p>
        <Link href="/challenges" className="text-emerald-600 text-sm hover:underline mt-2 inline-block">
          Return to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/challenges"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Challenges Feed
      </Link>

      <div className="bg-emerald-950 text-white rounded-2xl p-6 mb-8 border border-emerald-900 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          Target Problem for Adoption
        </div>
        <h2 className="text-xl font-bold text-slate-50 leading-tight">{challenge.title}</h2>
        <p className="text-xs text-emerald-200/80 mt-2 line-clamp-2">{challenge.description}</p>
        <div className="mt-3 text-xs text-emerald-300 font-medium">
          Location: {challenge.block_or_village ? `${challenge.block_or_village}, ` : ""}{challenge.district}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Submit R&D Adoption Proposal</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Commit university research capacity, technical methodology, and pilot timelines to solve this issue.
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>Proposal submitted successfully! Redirecting to Admin Triage...</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Proposal Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., IoT-Enabled Arsenic Adsorption & Community Water Purification"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Estimated Grant Budget (INR) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g., 450000"
                value={formData.estimated_budget}
                onChange={(e) => setFormData({ ...formData, estimated_budget: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Implementation Timeline *
              </label>
              <select
                value={formData.timeline_months}
                onChange={(e) => setFormData({ ...formData, timeline_months: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="3">3 Months (Rapid Prototype)</option>
                <option value="6">6 Months (Field Trial)</option>
                <option value="12">12 Months (Full Deployment)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Solution Abstract & Technical Methodology *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Detail the technical design, community rollout plan, and target measurable outcomes..."
              value={formData.solution_summary}
              onChange={(e) => setFormData({ ...formData, solution_summary: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Filing Proposal into Registry...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Adoption Proposal
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
