import React, { useState } from 'react';
import { BrandVoice } from '../types';
import { Plus, Trash2, Edit2, AlertCircle, Save, X, MessageSquare, Info } from 'lucide-react';

interface BrandVoiceListProps {
  brandVoices: BrandVoice[];
  onCreateVoice: (voice: Omit<BrandVoice, 'id' | 'userId' | 'createdAt'>) => void;
  onDeleteVoice: (id: string) => void;
}

export default function BrandVoiceList({ brandVoices, onCreateVoice, onDeleteVoice }: BrandVoiceListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [sample, setSample] = useState('');
  const [vocabulary, setVocabulary] = useState('');
  const [tone, setTone] = useState('');
  const [rules, setRules] = useState('');
  const [preferredPhrases, setPreferredPhrases] = useState('');
  const [avoidedPhrases, setAvoidedPhrases] = useState('');
  
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a profile name.");
      return;
    }
    if (!sample.trim()) {
      setError("Please paste a writing sample to analyze.");
      return;
    }

    onCreateVoice({
      name: name.trim(),
      sample: sample.trim(),
      vocabulary: vocabulary.trim(),
      tone: tone.trim(),
      rules: rules.trim(),
      preferredPhrases: preferredPhrases.trim(),
      avoidedPhrases: avoidedPhrases.trim()
    });

    // Reset fields
    setName('');
    setSample('');
    setVocabulary('');
    setTone('');
    setRules('');
    setPreferredPhrases('');
    setAvoidedPhrases('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Brand Voices</h1>
          <p className="text-slate-400 text-sm mt-1">Train custom voice blueprints from writing samples to overlay on any generation.</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-950/20 w-fit"
          >
            <Plus className="h-4 w-4" /> Create Voice Blueprint
          </button>
        )}
      </div>

      {isCreating ? (
        <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              New Brand Voice Blueprint
            </h2>
            <button 
              type="button" 
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs flex gap-2 items-start">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="voice-name" className="block text-xs font-semibold text-slate-300">Profile Name</label>
              <input 
                id="voice-name"
                type="text"
                placeholder="e.g., Tech Desi Reels, Bangalore SaaS Guru, Warm Newsletter Host"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>

            {/* Writing sample */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="voice-sample" className="block text-xs font-semibold text-slate-300">Writing Sample / Core Reference Copy</label>
              <textarea 
                id="voice-sample"
                rows={5}
                placeholder="Paste an existing post, caption, or newsletter that perfectly represents your tone, formatting, and structural rules..."
                value={sample}
                onChange={(e) => setSample(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-y font-sans"
              />
            </div>

            {/* Vocabulary Preference */}
            <div className="space-y-2">
              <label htmlFor="voice-vocab" className="block text-xs font-semibold text-slate-300">Vocabulary Guidelines</label>
              <input 
                id="voice-vocab"
                type="text"
                placeholder="e.g., Hinglish blended, tech-savvy, casual slang like 'bhai'"
                value={vocabulary}
                onChange={(e) => setVocabulary(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>

            {/* Tone Guidelines */}
            <div className="space-y-2">
              <label htmlFor="voice-tone" className="block text-xs font-semibold text-slate-300">Aesthetic Tone description</label>
              <input 
                id="voice-tone"
                type="text"
                placeholder="e.g., Energetic, street-smart, mentor-like, informative"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>

            {/* Formatting Preference */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="voice-rules" className="block text-xs font-semibold text-slate-300">Formatting/Structure Preferences</label>
              <input 
                id="voice-rules"
                type="text"
                placeholder="e.g., Use rich line spacing, bullet points, and high emoji density."
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>

            {/* Phrases to prefer */}
            <div className="space-y-2">
              <label htmlFor="voice-preferred" className="block text-xs font-semibold text-slate-300">Preferred Phrases/Keywords (Comma separated)</label>
              <input 
                id="voice-preferred"
                type="text"
                placeholder="dosto, dhandha, scale, growth hack, kamaal hai"
                value={preferredPhrases}
                onChange={(e) => setPreferredPhrases(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>

            {/* Phrases to avoid */}
            <div className="space-y-2">
              <label htmlFor="voice-avoided" className="block text-xs font-semibold text-slate-300">Avoided Phrases/Keywords (Comma separated)</label>
              <input 
                id="voice-avoided"
                type="text"
                placeholder="utilize, leverage, synergy, furthermore, nevertheless"
                value={avoidedPhrases}
                onChange={(e) => setAvoidedPhrases(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-6">
            <button 
              type="button" 
              onClick={() => setIsCreating(false)}
              className="bg-slate-950 hover:bg-slate-800 text-slate-400 px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition-colors"
            >
              <Save className="h-4 w-4" /> Save Voice Blueprint
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brandVoices.map(voice => (
            <div key={voice.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-orange-500" />
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-orange-400 transition-colors">{voice.name}</h3>
                  </div>
                  {voice.id !== 'bv-desi-1' && voice.id !== 'bv-corporate-1' && (
                    <button 
                      onClick={() => onDeleteVoice(voice.id)}
                      className="text-slate-600 hover:text-red-400 p-1 rounded-lg"
                      title="Delete profile"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="mt-4 space-y-3.5 text-xs text-slate-400">
                  <div>
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[9px] block">Vocabulary style:</span>
                    <span className="text-slate-300 mt-1 block">{voice.vocabulary || 'None'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[9px] block">Preferred Tone:</span>
                    <span className="text-slate-300 mt-1 block">{voice.tone || 'None'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[9px] block">Formatting Preferences:</span>
                    <span className="text-slate-300 mt-1 block truncate">{voice.rules || 'None'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[9px] block">Writing Sample snippet:</span>
                    <span className="text-slate-300 mt-1 block italic bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 line-clamp-2">
                      "{voice.sample}"
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-800/60 pt-4 flex justify-between items-center text-[10px] text-slate-500">
                <span>Created {new Date(voice.createdAt).toLocaleDateString()}</span>
                { (voice.id === 'bv-desi-1' || voice.id === 'bv-corporate-1') && (
                  <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded font-semibold">Standard Blueprint</span>
                ) }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
