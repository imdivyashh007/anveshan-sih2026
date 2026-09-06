"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { MapPin, ThumbsUp, Tag, Search, Filter, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];

const JHARKHAND_DISTRICTS = [
  "All",
  "Dumka",
  "Sahebganj",
  "Chaibasa (West Singhbhum)",
  "Ranchi",
  "Dhanbad",
  "Jamshedpur (East Singhbhum)",
  "Bokaro",
  "Hazaribagh",
];

export default function ChallengesFeedPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [upvotingId, setUpvotingId] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, [selectedDistrict]);

  const fetchChallenges = async () => {
    setLoading(true);
    let query = supabase
      .from("challenges")
      .select("*")
      .order("upvotes", { ascending: false });

    if (selectedDistrict !== "All") {
      query = query.eq("district", selectedDistrict);
    }

    const { data, error } = await query;
    if (!error && data) {
      setChallenges(data as Challenge[]);
    }
    setLoading(false);
  };

  const handleUpvote = async (id: string, currentUpvotes: number) => {
    setUpvotingId(id);
    const updatedCount = currentUpvotes + 1;

    setChallenges((prev) =>
      prev.map((item) => (item.id === id ? { ...item, upvotes: updatedCount } : item))
    );

    await supabase
      .from("challenges")
      .update({ upvotes: updatedCount })
      .eq("id", id);

    setUpvotingId(null);
  };

  const filteredChallenges = challenges.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Adoptable Challenges Feed
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Grassroots societal challenges across Jharkhand open for university R&D adoption and grants.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems, domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
      </div>

      {/* District Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
        <Filter className="w-4 h-4 text-slate-500 flex-shrink-0 mr-1" />
        {JHARKHAND_DISTRICTS.map((district) => (
          <button
            key={district}
            onClick={() => setSelectedDistrict(district)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedDistrict === district
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {district}
          </button>
        ))}
      </div>

      {/* Cards Feed */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-500 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Fetching grassroots challenges...</span>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl p-8">
          <p className="text-slate-600 font-medium">No challenges found matching this criteria.</p>
          <p className="text-xs text-slate-400 mt-1">Try selecting another district or resetting your search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    <Tag className="w-3 h-3" />
                    {challenge.category}
                  </span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    challenge.status === "Adopted" 
                      ? "bg-emerald-100 text-emerald-800 font-semibold"
                      : challenge.status === "Under Review"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {challenge.status}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 text-base line-clamp-2 leading-snug">
                  {challenge.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate max-w-[110px]">
                    {challenge.district}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpvote(challenge.id, challenge.upvotes)}
                    disabled={upvotingId === challenge.id}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 hover:text-emerald-700 transition cursor-pointer"
                    title="Upvote"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-semibold">{challenge.upvotes}</span>
                  </button>

                  <Link
                    href={`/challenges/${challenge.id}/adopt`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition cursor-pointer"
                  >
                    <span>Adopt</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
