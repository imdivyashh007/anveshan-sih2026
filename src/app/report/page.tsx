'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { analyzeEngineeringText, AnalysisResult } from '@/lib/nlpAnalyzer';
import { 
  Sparkles, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Loader2, 
  Tag, 
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

const JHARKHAND_DISTRICTS = [
  'Sahebganj', 'Dumka', 'Ranchi', 'Chaibasa (West Singhbhum)', 
  'Dhanbad', 'Bokaro', 'Hazaribagh', 'Jamshedpur (East Singhbhum)',
  'Deoghar', 'Giridih', 'Palamu', 'Ramgarh'
];

const CATEGORIES = [
  'Water & Sanitation',
  'Renewable Energy',
  'Agriculture & Post-Harvest',
  'Environmental & Mining',
  'Rural Infrastructure'
];

export default function ReportProblemPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [district, setDistrict] = useState(JHARKHAND_DISTRICTS[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const analysis: AnalysisResult = analyzeEngineeringText(description);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from('challenges').insert([
      {
        title,
        district,
        category,
        description,
        status: 'Reported',
        upvotes: 1
      }
    ]);

    setSubmitting(false);
    if (!error) {
      router.push('/challenges');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs px-3.5 py-2 rounded-lg shadow-xs">
  <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
    <span className="font-bold">Verified Citizen Ingestion:</span>
    <span className="text-emerald-800 text-[11px]">
      Authenticated via MeriPehchan / e-Pramaan Sandbox Gateway
    </span>
  </div>
</div>
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
          Grassroots Ingestion Terminal
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Log Civic Engineering Bottleneck</h1>
        <p className="text-sm text-slate-600 mt-1">
          Provide ground data from Jharkhand districts. Our automated triage pipeline extracts technical domains for university R&D adoption.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Input Form */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Problem Statement Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Heavy Slag Leaching into Subsurface Aquifers"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Target District
              </label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {JHARKHAND_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Engineering Sector
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Technical Failure Description
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {description.length} characters
              </span>
            </div>
            <textarea
              required
              rows={6}
              placeholder="Describe what is failing, the local context, quantifiable indicators (e.g. 0.08 mg/L arsenic, 12V battery failure within 9 months), and past failed repair attempts..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || description.trim().length < 15}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg transition disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Broadcasting to State Clearinghouse...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit to State Innovation Council</span>
              </>
            )}
          </button>
        </div>

        {/* Live AI Analysis Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-slate-200 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                NLP Triage Assistant
              </span>
            </div>

            {/* Completeness Index */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-slate-400">Completeness Index:</span>
                <span className={analysis.completenessScore >= 70 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {analysis.completenessScore}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    analysis.completenessScore >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${analysis.completenessScore}%` }}
                />
              </div>
            </div>

            {/* Extracted Domains */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Detected Sub-Domains:</span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.extractedDomains.map((dom) => (
                  <span key={dom} className="text-[10px] font-medium bg-slate-800 border border-slate-700 text-emerald-300 px-2 py-0.5 rounded">
                    {dom}
                  </span>
                ))}
              </div>
            </div>

            {/* Dynamic Recommendations */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">State Formulation Feedback:</span>
              {analysis.recommendations.length > 0 ? (
                <ul className="space-y-1 text-[11px] text-slate-400">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-amber-300/80">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Specification exceeds minimum state audit criteria.</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-800 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Automatic Deduplication
            </p>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Every challenge is geofenced against existing complaints to eliminate duplicate public reporting in the same block.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}