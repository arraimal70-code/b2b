import React from 'react';
import { UserProfile } from '../types';
import { Check, Coins, CreditCard, Shield, Sparkles } from 'lucide-react';

interface BillingProps {
  userProfile: UserProfile;
  onSelectPlan: (tier: 'Free' | 'Pro' | 'Ultimate', price: number) => void;
  onTopUpCredits: () => void;
}

export default function Billing({ userProfile, onSelectPlan, onTopUpCredits }: BillingProps) {
  const plans = [
    {
      name: "Creator Starter",
      tier: "Free" as const,
      price: 0,
      description: "Ideal for experimenting and solopreneurs.",
      features: [
        "10 Free credits monthly",
        "YouTube link parsing",
        "Paste transcript input",
        "Standard preset tones",
        "LinkedIn & X formats"
      ]
    },
    {
      name: "Content Forge Pro",
      tier: "Pro" as const,
      price: 1499,
      description: "For active creators scaling their personal brand.",
      features: [
        "150 Forge credits monthly",
        "All 7 platform formats unlocked",
        "Custom Brand Voice CRUD profiles",
        "Secure audio/video file uploads",
        "Heuristic Evals Dashboard analytics"
      ],
      popular: true
    },
    {
      name: "Forge Ultimate",
      tier: "Ultimate" as const,
      price: 3999,
      description: "For multi-creator agencies and content teams.",
      features: [
        "500 Forge credits monthly",
        "Everything in Pro",
        "Early access to new features",
        "API access & webhooks",
        "24/7 Priority Whatsapp support"
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Plans</h1>
        <p className="text-slate-400 text-sm mt-1">Upgrade your plan or top up your credits instantly to keep forging content.</p>
      </div>

      {/* Credit Status Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-orange-500/10 p-4 rounded-xl text-orange-400">
            <Coins className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Your Current Balance</h3>
            <p className="text-2xl font-extrabold text-white mt-1">{userProfile.credits} Credits</p>
            <p className="text-[10px] text-slate-500 mt-1">Tier: <span className="text-orange-400 font-semibold">{userProfile.tier}</span></p>
          </div>
        </div>

        <button 
          onClick={onTopUpCredits}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl text-xs transition-colors shadow-lg shadow-orange-950/20 shrink-0"
        >
          <Sparkles className="h-4 w-4" /> Top up 50 Credits (₹499)
        </button>
      </div>

      {/* Plan Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((p, i) => {
          const isCurrent = userProfile.tier === p.tier;
          return (
            <div 
              key={i} 
              className={`bg-slate-900 rounded-2xl border p-8 flex flex-col justify-between relative ${
                p.popular ? 'border-orange-500 shadow-xl shadow-orange-950/10' : 'border-slate-800'
              }`}
            >
              {p.popular && (
                <span className="absolute top-0 right-6 translate-y-[-50%] bg-orange-600 text-white text-[9px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-100">{p.name}</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{p.description}</p>
                
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">₹{p.price}</span>
                  <span className="text-slate-500 text-xs">/month</span>
                </div>

                <ul className="mt-8 flex flex-col gap-3 text-xs text-slate-300">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-orange-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => !isCurrent && onSelectPlan(p.tier, p.price)}
                disabled={isCurrent}
                className={`mt-8 w-full py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isCurrent 
                    ? 'bg-slate-950 text-slate-500 cursor-not-allowed border border-slate-800' 
                    : p.popular 
                      ? 'bg-orange-600 hover:bg-orange-500 text-white' 
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800'
                }`}
              >
                {isCurrent ? 'Current Plan' : `Upgrade to ${p.tier}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Security note */}
      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-slate-500 text-[11px] flex gap-2 items-center">
        <Shield className="h-4 w-4 text-orange-500 shrink-0" />
        <span>All payments are simulated for review purposes. In production, billing is processed securely via Razorpay/Stripe, guaranteeing data privacy.</span>
      </div>
    </div>
  );
}
