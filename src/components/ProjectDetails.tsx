import React, { useState, useEffect } from 'react';
import { Project, BrandVoice, AIQualityMetric } from '../types';
import { ArrowLeft, Copy, Check, Edit2, CheckSquare, Save, RefreshCw, AlertTriangle, Play, HelpCircle, Download, Sparkles, Award } from 'lucide-react';

interface ProjectDetailsProps {
  project: Project;
  brandVoices: BrandVoice[];
  onBack: () => void;
  onUpdateOutputs: (projectId: string, updatedOutputs: Record<string, string>) => void;
  onRegenerate: (project: Project) => void;
}

export default function ProjectDetails({ project, brandVoices, onBack, onUpdateOutputs, onRegenerate }: ProjectDetailsProps) {
  const [activeFormat, setActiveFormat] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [copied, setCopied] = useState(false);
  const [evalResult, setEvalResult] = useState<AIQualityMetric | null>(null);

  // Set initial active format once project or activeFormat changes
  useEffect(() => {
    if (project.formatsSelected.length > 0) {
      if (!activeFormat || !project.formatsSelected.includes(activeFormat)) {
        setActiveFormat(project.formatsSelected[0]);
      }
    }
  }, [project, activeFormat]);

  // Handle setting edit text when active format changes
  useEffect(() => {
    if (activeFormat && project.outputs[activeFormat]) {
      setEditText(project.outputs[activeFormat]);
    } else {
      setEditText('');
    }
  }, [activeFormat, project.outputs]);

  // Run Evals on Output
  useEffect(() => {
    if (project.status === 'completed' && activeFormat && project.outputs[activeFormat]) {
      const text = project.outputs[activeFormat];
      const selectedVoice = brandVoices.find(v => v.id === project.brandVoiceId);

      // 1. Format Compliance
      // e.g. X/Twitter Thread should contain numbered tweets. LinkedIn post should have bullet points.
      let formatCompliance = true;
      if (activeFormat === 'X/Twitter Thread') {
        formatCompliance = text.includes('1/') || text.includes('1\\');
      } else if (activeFormat === 'LinkedIn Carousel') {
        formatCompliance = text.toLowerCase().includes('slide');
      }

      // 2. Source-grounding keyword overlap (Mock algorithm but deterministic)
      // Checks for overlap of terms related to tech, agency, marketing, bootstrap, etc.
      const sourceKeywords = ['startup', 'saas', 'agency', 'no-code', 'growth', 'dhandha', 'lakh', 'rupee', 'marketing', 'tech', 'video'];
      let overlapCount = 0;
      sourceKeywords.forEach(keyword => {
        if (text.toLowerCase().includes(keyword)) overlapCount++;
      });
      const overlapScore = Math.min(Math.round((overlapCount / 4) * 100), 100);

      // 3. Safety regex blocklist (sensitive keywords)
      const safetyKeywords = ['spam', 'scam', 'fraud', 'illegal', 'hacker', 'phishing'];
      let safetyCheck = true;
      safetyKeywords.forEach(keyword => {
        if (text.toLowerCase().includes(keyword)) safetyCheck = false;
      });

      // 4. Length budget
      let lengthBudget = true;
      if (activeFormat === 'X/Twitter Thread') {
        // Ensure tweets split are roughly within bounds
        const tweets = text.split(/\n\n+/);
        tweets.forEach(t => {
          if (t.length > 300) lengthBudget = false;
        });
      }

      // 5. Hinglish markers
      const hinglishMarkers = ['yaar', 'toh', 'hai', 'bhai', 'fayda', 'socho', 'sahi', 'karo', 'dosto', 'dhandha', 'kamaal', 'seeking'];
      let hinglishMarker = false;
      if (project.tone === 'Desi / Hinglish') {
        hinglishMarkers.forEach(word => {
          if (text.toLowerCase().includes(word)) hinglishMarker = true;
        });
      } else {
        hinglishMarker = true; // Not required for non-Hinglish tones
      }

      const score = Math.round(
        ( (formatCompliance ? 20 : 0) + 
          (overlapScore >= 50 ? 20 : 10) + 
          (safetyCheck ? 20 : 0) + 
          (lengthBudget ? 20 : 0) + 
          (hinglishMarker ? 20 : 0) )
      );

      setEvalResult({
        format: activeFormat,
        passed: score >= 80,
        score,
        checks: {
          formatCompliance,
          sourceGrounding: overlapScore >= 40,
          safetyCheck,
          lengthBudget,
          hinglishMarker
        }
      });
    } else {
      setEvalResult(null);
    }
  }, [project, activeFormat, brandVoices]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    const updated = { ...project.outputs, [activeFormat]: editText };
    onUpdateOutputs(project.id, updated);
    setIsEditing(false);
  };

  const handleExportText = () => {
    const element = document.createElement("a");
    const file = new Blob([editText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${project.title.replace(/\s+/g, '_')}_${activeFormat.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight truncate max-w-xl">{project.title}</h1>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="capitalize">{project.sourceType}</span>
            <span>•</span>
            <span>{project.tone}</span>
            <span>•</span>
            <span>Created on {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Main layout based on state */}
      {project.status === 'queued' || project.status === 'processing' ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto">
            {/* Spinning gradient circle */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-slate-200 font-bold text-lg">Forging Content Assets...</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Our AI engine is currently researching the source and generating optimized copy for all chosen formats. This usually takes about 15-30 seconds.
            </p>
          </div>
          {/* Skeleton representation */}
          <div className="max-w-md mx-auto space-y-3 pt-4">
            <div className="h-4 bg-slate-950 rounded w-3/4 mx-auto animate-pulse"></div>
            <div className="h-3 bg-slate-950 rounded w-1/2 mx-auto animate-pulse"></div>
            <div className="h-3 bg-slate-950 rounded w-5/6 mx-auto animate-pulse"></div>
          </div>
        </div>
      ) : project.status === 'failed' ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center max-w-2xl mx-auto space-y-6">
          <div className="bg-red-500/10 p-4 rounded-full text-red-500 w-fit mx-auto">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-red-400 font-bold text-lg">Generation Failed</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              We encountered an error while processing this project. Provider outages, invalid video links, quota blocks, or heavy system loads can cause this.
            </p>
            {project.errorMsg && (
              <div className="bg-slate-950 text-red-400 font-mono text-xs p-4 rounded-xl border border-slate-800 text-left max-h-32 overflow-y-auto mt-4">
                {project.errorMsg}
              </div>
            )}
          </div>
          <div className="pt-4 flex justify-center gap-4">
            <button 
              onClick={() => onRegenerate(project)}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Retry Generation
            </button>
            <button 
              onClick={onBack}
              className="bg-slate-950 hover:bg-slate-800 text-slate-300 px-6 py-2.5 rounded-xl text-xs border border-slate-800 transition-colors"
            >
              Back to Projects
            </button>
          </div>
        </div>
      ) : (
        // Completed State
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Outputs display */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Format Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {project.formatsSelected.map(format => (
                <button
                  key={format}
                  onClick={() => {
                    setActiveFormat(format);
                    setIsEditing(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeFormat === format 
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-950/20' 
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>

            {/* Content Panel */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                  {activeFormat} OUTPUT
                </span>
                
                {/* Actions */}
                <div className="flex items-center gap-2 text-xs">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleSaveEdit}
                        className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
                      >
                        <Save className="h-3.5 w-3.5" /> Save
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setEditText(project.outputs[activeFormat] || '');
                        }}
                        className="text-slate-400 hover:text-slate-300 font-semibold px-2 py-1.5"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-2 rounded-lg transition-all"
                        title="Edit output inline"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={handleCopy}
                        className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-2 rounded-lg transition-all relative"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button 
                        onClick={handleExportText}
                        className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-2 rounded-lg transition-all"
                        title="Export as txt"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Editable / Viewer Area */}
              {isEditing ? (
                <textarea 
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={15}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-y font-sans"
                />
              ) : (
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-sm leading-relaxed text-slate-300 font-sans whitespace-pre-wrap select-text max-h-[500px] overflow-y-auto">
                  {project.outputs[activeFormat] || "No output generated for this format."}
                </div>
              )}
            </div>

            {/* Regenerate Block */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Not happy with this draft?</h3>
                <p className="text-slate-500 text-xs mt-0.5">Regenerate everything using a different tone preset or customized Brand Voice profile.</p>
              </div>
              <button 
                onClick={() => onRegenerate(project)}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-orange-400 border border-orange-500/20 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md shrink-0"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Re-Forge All Formats
              </button>
            </div>

          </div>

          {/* Right Column: AI Evals & Quality Indicators */}
          <div className="space-y-6">
            
            {/* AI Quality / Eval panel */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-500" />
                <h2 className="text-base font-bold text-slate-100">Deterministic Evals</h2>
              </div>

              {evalResult ? (
                <div className="space-y-6">
                  {/* Big Circular Score */}
                  <div className="text-center bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Forge Quality Index</span>
                    <div className="text-3xl font-extrabold text-orange-500 mt-1">{evalResult.score}%</div>
                    <span className={`text-[10px] font-semibold mt-1 inline-block ${evalResult.passed ? 'text-green-400' : 'text-yellow-400'}`}>
                      {evalResult.passed ? '✅ Passed Quality Threshold' : '⚠️ Moderate quality. Check guidelines.'}
                    </span>
                  </div>

                  {/* Criteria checks */}
                  <div className="space-y-3.5 text-xs">
                    
                    {/* Check 1 */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Format Compliance</span>
                      <span className={`font-semibold ${evalResult.checks.formatCompliance ? 'text-green-400' : 'text-red-400'}`}>
                        {evalResult.checks.formatCompliance ? 'Pass' : 'Fail'}
                      </span>
                    </div>

                    {/* Check 2 */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Source Grounding Overlap</span>
                      <span className={`font-semibold ${evalResult.checks.sourceGrounding ? 'text-green-400' : 'text-yellow-400'}`}>
                        {evalResult.checks.sourceGrounding ? 'High' : 'Low'}
                      </span>
                    </div>

                    {/* Check 3 */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Safety Regex Guard</span>
                      <span className={`font-semibold ${evalResult.checks.safetyCheck ? 'text-green-400' : 'text-red-400'}`}>
                        {evalResult.checks.safetyCheck ? 'Secure' : 'Alert'}
                      </span>
                    </div>

                    {/* Check 4 */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Length Budget Check</span>
                      <span className={`font-semibold ${evalResult.checks.lengthBudget ? 'text-green-400' : 'text-yellow-400'}`}>
                        {evalResult.checks.lengthBudget ? 'Optimal' : 'Exceeded'}
                      </span>
                    </div>

                    {/* Check 5 */}
                    {project.tone === 'Desi / Hinglish' && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Hinglish Markers</span>
                        <span className={`font-semibold ${evalResult.checks.hinglishMarker ? 'text-green-400' : 'text-yellow-400'}`}>
                          {evalResult.checks.hinglishMarker ? 'Detected' : 'Not found'}
                        </span>
                      </div>
                    )}

                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-xs text-center py-4">No metrics available.</p>
              )}
            </div>

            {/* Source Meta Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 text-xs">
              <h3 className="font-bold text-slate-100">Forge Config Summary</h3>
              
              <div className="space-y-2 text-slate-400">
                <div className="flex justify-between">
                  <span>Source Type</span>
                  <span className="capitalize text-slate-200 font-semibold">{project.sourceType}</span>
                </div>
                {project.sourceUrl && (
                  <div className="flex justify-between">
                    <span>Link</span>
                    <a href={project.sourceUrl} target="_blank" referrerPolicy="no-referrer" className="text-orange-400 hover:underline truncate max-w-[150px]">
                      {project.sourceUrl}
                    </a>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tone Presets</span>
                  <span className="text-slate-200 font-semibold">{project.tone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Voice Overlays</span>
                  <span className="text-slate-200 font-semibold">
                    {brandVoices.find(v => v.id === project.brandVoiceId)?.name || 'None (Preset-Only)'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
