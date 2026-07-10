import React from 'react';
import { Sparkles, Youtube, Zap, MessageSquare, Check, ArrowRight, Play, Award } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onGoToDashboard: () => void;
  isLoggedIn: boolean;
}

export default function LandingPage({ onStart, onGoToDashboard, isLoggedIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 p-2 rounded-lg text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              ContentForge AI
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-slate-400 hover:text-orange-400 transition-colors text-sm font-medium">Features</a>
            <a href="#pricing" className="text-slate-400 hover:text-orange-400 transition-colors text-sm font-medium">Pricing</a>
            {isLoggedIn ? (
              <button 
                onClick={onGoToDashboard}
                className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-orange-950"
              >
                Go to Dashboard
              </button>
            ) : (
              <button 
                onClick={onStart}
                className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-orange-950"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-950/20 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold tracking-wider uppercase mb-8">
            <Award className="h-3.5 w-3.5" /> Built for Indian Creators
          </div>
          
          <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Turn one YouTube video into a <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">month of content</span>.
          </h1>
          
          <p className="mt-6 text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Stop spending hours drafting posts manually. ContentForge AI extracts high-quality LinkedIn posts, X threads, Reels scripts, and newsletters in <span className="text-orange-400 font-semibold">your voice</span>. Perfect for Desi and Hinglish creators!
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-xl shadow-orange-900/30 hover:translate-y-[-1px]"
            >
              Start Forging Free <ArrowRight className="h-5 w-5" />
            </button>
            <a 
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 font-medium px-8 py-4 rounded-xl text-base transition-all duration-200"
            >
              <Play className="h-4.5 w-4.5 text-orange-500 fill-orange-500" /> Watch Demo
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-slate-500 text-xs">
            <span className="flex items-center gap-1"><Check className="h-4 w-4 text-orange-500" /> No credit card required</span>
            <span className="flex items-center gap-1"><Check className="h-4 w-4 text-orange-500" /> 10 Free credits monthly</span>
            <span className="flex items-center gap-1"><Check className="h-4 w-4 text-orange-500" /> Grounded in truth</span>
          </div>
        </div>

        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40"></div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-24 bg-slate-900 border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Forged for Indian Ecosystem. Engine Powered by Gemini.
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              The content economy in India is booming. ContentForge AI provides tailor-made tools for creators building for Bangalore tech, Mumbai finance, or Delhi startups.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition-all duration-300 flex flex-col gap-4 group">
              <div className="bg-orange-500/10 p-4 rounded-xl text-orange-500 w-fit group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-sans font-semibold text-xl text-white">Lightning Fast Generation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Repurpose an entire YouTube video, MP3 file, or raw text script in less than 30 seconds. Perfect for staying on top of rapid social media cycles.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition-all duration-300 flex flex-col gap-4 group">
              <div className="bg-orange-500/10 p-4 rounded-xl text-orange-500 w-fit group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-sans font-semibold text-xl text-white">Your Brand Voice</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Train custom AI models using your actual written samples. Choose standard English or a natural, highly engaging <span className="text-orange-400 font-semibold">Desi / Hinglish style</span> to charm your audience.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition-all duration-300 flex flex-col gap-4 group">
              <div className="bg-orange-500/10 p-4 rounded-xl text-orange-500 w-fit group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                <Youtube className="h-6 w-6" />
              </div>
              <h3 className="font-sans font-semibold text-xl text-white">Format Optimized Outputs</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Get perfectly structured LinkedIn carousels, Twitter/X threads, high-energy Reels scripts, and newsletters. Handcrafted markdown output that is ready to publish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase mb-10">Powering top creators in the country</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-extrabold text-orange-500">12,000+</span>
              <span className="text-slate-400 text-xs">Pieces Forged</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-extrabold text-orange-500">2,500+</span>
              <span className="text-slate-400 text-xs">Indian Creators</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-extrabold text-orange-500">450,000+</span>
              <span className="text-slate-400 text-xs">Hours Saved</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-extrabold text-orange-500">₹0 Cost</span>
              <span className="text-slate-400 text-xs">To Start Today</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-tight">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-slate-400 text-sm">Cancel or change plans any time. Free forever tier available.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-slate-100 font-bold text-lg">Creator Starter</h3>
                <p className="text-slate-400 text-xs mt-1">For budding builders and solopreneurs.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">₹0</span>
                  <span className="text-slate-500 text-xs">/month</span>
                </div>
                <ul className="mt-6 flex flex-col gap-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-500" /> 10 Free credits monthly</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-500" /> YouTube & text import</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-500" /> Casual & Hinglish tones</li>
                  <li className="flex items-center gap-2 text-slate-500"><Check className="h-4 w-4 text-slate-700" /> Custom Brand Voice CRUD</li>
                </ul>
              </div>
              <button onClick={onStart} className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-slate-200 py-2.5 rounded-lg text-xs font-semibold border border-slate-700 transition-colors">
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-950 p-8 rounded-2xl border-2 border-orange-500 relative flex flex-col justify-between shadow-2xl shadow-orange-950/20">
              <div className="absolute top-0 right-6 translate-y-[-50%] bg-orange-600 text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div>
                <h3 className="text-slate-100 font-bold text-lg">Content Forge Pro</h3>
                <p className="text-slate-400 text-xs mt-1">For active daily creators scaling fast.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">₹1,499</span>
                  <span className="text-slate-500 text-xs">/month</span>
                </div>
                <ul className="mt-6 flex flex-col gap-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-500" /> 150 Forge credits monthly</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-500" /> All output platforms unlocked</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-500" /> Unlimited Brand Voice profiles</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-500" /> Audio/video media file uploads</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-500" /> Deterministic Quality metrics</li>
                </ul>
              </div>
              <button onClick={onStart} className="mt-8 w-full bg-orange-600 hover:bg-orange-500 text-white py-2.5 rounded-lg text-xs font-semibold transition-colors">
                Upgrade to Pro
              </button>
            </div>

            {/* Ultimate Plan */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-slate-100 font-bold text-lg">Forge Ultimate</h3>
                <p className="text-slate-400 text-xs mt-1">For agency leaders & media companies.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">₹3,999</span>
                  <span className="text-slate-500 text-xs">/month</span>
                </div>
                <ul className="mt-6 flex flex-col gap-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-500" /> 500 Forge credits monthly</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-500" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-500" /> API Access & Webhooks</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-orange-500" /> 24/7 dedicated Whatsapp support</li>
                </ul>
              </div>
              <button onClick={onStart} className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-slate-200 py-2.5 rounded-lg text-xs font-semibold border border-slate-700 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 mt-auto text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-orange-500" />
            <span className="text-slate-300 font-bold">ContentForge AI</span>
          </div>
          <p>© 2026 ContentForge AI. Built for the modern Indian creator economy.</p>
          <div className="flex gap-4 text-xs">
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
