import React from 'react';
import { BookOpen, Trophy, Sparkles, Star, Users, Flame } from 'lucide-react';

export default function CaseStudy() {
  const cases = [
    {
      creator: "Ankur Warikoo (Simulated Vibe)",
      niche: "Personal Finance & Entrepreneurship",
      stats: "Saved 18 hours/week",
      quote: "Forging our YouTube long-form transcripts into LinkedIn and newsletter copy has doubled our distribution pipeline. The Desi / Hinglish tone matches how we speak organically.",
      growth: "+140% LinkedIn Reach",
      badge: "Finance Guru"
    },
    {
      creator: "Raj Shamani (Simulated Vibe)",
      niche: "Business Podcast & Startup Ecosystem",
      stats: "30+ Threads/Month Generated",
      quote: "We use ContentForge to turn long interview transcripts with Indian founders into hyper-engaging Twitter threads. It has completely automated our social presence.",
      growth: "5x Growth in Impressions",
      badge: "Podcast Star"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Creator Success Case Studies</h1>
        <p className="text-slate-400 text-sm mt-1">See how leading Indian creators are cutting hours off their production schedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cases.map((cs, i) => (
          <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-bl-full group-hover:bg-orange-600/10 transition-colors"></div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                  {cs.badge}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{cs.stats}</span>
              </div>

              <h2 className="text-lg font-bold text-white tracking-tight">{cs.creator}</h2>
              <p className="text-slate-400 text-xs italic leading-relaxed">
                "{cs.quote}"
              </p>
            </div>

            <div className="border-t border-slate-800/60 pt-6 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs">
                <Users className="h-4 w-4 text-orange-500" />
                <span className="text-slate-400">{cs.niche}</span>
              </div>
              <span className="text-xs font-bold text-green-400">{cs.growth}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Playbook section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
        <div className="bg-orange-500/10 p-4 rounded-xl text-orange-400">
          <BookOpen className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            Get our Indian Creator Playbook <Sparkles className="h-4 w-4 text-orange-400" />
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Download our free 45-page comprehensive playbook detailing exactly how to turn a single YouTube podcast into over 28 high-conversion pieces of content for LinkedIn, X/Twitter, Instagram Reels, and newsletter copies.
          </p>
          <button className="bg-orange-600 hover:bg-orange-500 text-white font-semibold text-[11px] px-4 py-2 rounded-lg mt-3 transition-colors">
            Download Playbook (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
