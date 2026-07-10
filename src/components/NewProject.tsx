import React, { useState, useRef } from 'react';
import { BrandVoice, SourceType } from '../types';
import { Youtube, Upload, AlignLeft, Info, HelpCircle, Check, Play, AlertCircle, FileText } from 'lucide-react';

interface NewProjectProps {
  brandVoices: BrandVoice[];
  onGenerate: (projectData: {
    title: string;
    sourceType: SourceType;
    sourceUrl?: string;
    sourceText?: string;
    fileBase64?: string;
    fileMimeType?: string;
    fileName?: string;
    tone: string;
    brandVoiceId: string | null;
    formatsSelected: string[];
  }) => void;
  credits: number;
}

export default function NewProject({ brandVoices, onGenerate, credits }: NewProjectProps) {
  const [title, setTitle] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('youtube');
  
  // YouTube Fields
  const [youtubeUrl, setYoutubeUrl] = useState('');
  
  // File upload fields
  const [fileBase64, setFileBase64] = useState<string | undefined>(undefined);
  const [fileMimeType, setFileMimeType] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paste transcript fields
  const [pastedTranscript, setPastedTranscript] = useState('');

  // Settings
  const [selectedTone, setSelectedTone] = useState('Desi / Hinglish');
  const [selectedBrandVoiceId, setSelectedBrandVoiceId] = useState<string>('');
  
  // Output formats
  const availableFormats = [
    'LinkedIn Post',
    'LinkedIn Carousel',
    'X/Twitter Thread',
    'Instagram Caption',
    'Reels Script',
    'Blog Post',
    'Email Newsletter'
  ];
  
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['LinkedIn Post', 'X/Twitter Thread']);

  // Validation
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleFormat = (format: string) => {
    if (selectedFormats.includes(format)) {
      setSelectedFormats(selectedFormats.filter(f => f !== format));
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  const selectAllFormats = () => {
    setSelectedFormats(availableFormats);
  };

  const deselectAllFormats = () => {
    setSelectedFormats([]);
  };

  // Convert uploaded file to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const processUploadedFile = (file: File) => {
    // Check file size limit: let's set to 15MB max for audio/video base64
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
      setValidationError("File is too large. Max size is 15MB.");
      return;
    }

    setValidationError(null);
    setFileName(file.name);
    setFileMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64Content = reader.result.split(',')[1];
        setFileBase64(base64Content);
      }
    };
    reader.onerror = () => {
      setValidationError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate global details
    if (!title.trim()) {
      setValidationError("Please enter a project title.");
      return;
    }

    if (selectedFormats.length === 0) {
      setValidationError("Please select at least one output format.");
      return;
    }

    if (credits < 1) {
      setValidationError("You do not have enough credits to forge content. Please top up your account.");
      return;
    }

    // Validate source specific inputs
    if (sourceType === 'youtube') {
      if (!youtubeUrl.trim()) {
        setValidationError("Please enter a valid YouTube URL.");
        return;
      }
      const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      if (!ytRegex.test(youtubeUrl)) {
        setValidationError("Invalid YouTube URL. Please use standard formats (youtube.com or youtu.be).");
        return;
      }
    } else if (sourceType === 'file') {
      if (!fileBase64) {
        setValidationError("Please upload a file or record content.");
        return;
      }
    } else if (sourceType === 'transcript') {
      if (!pastedTranscript.trim() || pastedTranscript.trim().length < 20) {
        setValidationError("Please paste a comprehensive transcript or document (minimum 20 characters).");
        return;
      }
    }

    onGenerate({
      title: title.trim(),
      sourceType,
      sourceUrl: sourceType === 'youtube' ? youtubeUrl : undefined,
      sourceText: sourceType === 'transcript' ? pastedTranscript : undefined,
      fileBase64: sourceType === 'file' ? fileBase64 : undefined,
      fileMimeType: sourceType === 'file' ? fileMimeType : undefined,
      fileName: sourceType === 'file' ? fileName : undefined,
      tone: selectedTone,
      brandVoiceId: selectedBrandVoiceId ? selectedBrandVoiceId : null,
      formatsSelected: selectedFormats
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Forge New Content</h1>
        <p className="text-slate-400 text-sm mt-1">Transform any video or text source into highly engaging social media formats.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Error Callout */}
        {validationError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs flex gap-2 items-start">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Section 1: Project Details */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold">1</span>
            Project Details
          </h2>
          
          <div className="space-y-2">
            <label htmlFor="project-title" className="block text-xs font-semibold text-slate-300">Project Title</label>
            <input 
              id="project-title"
              type="text"
              placeholder="e.g., Growing an Agency to 10 Lakhs/mo Guide"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Section 2: Choose Source Material */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold">2</span>
            Source Material
          </h2>

          {/* Tab Selector */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSourceType('youtube')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                sourceType === 'youtube' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Youtube className="h-4 w-4" /> YouTube Link
            </button>
            <button
              type="button"
              onClick={() => setSourceType('file')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                sourceType === 'file' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Upload className="h-4 w-4" /> Upload File
            </button>
            <button
              type="button"
              onClick={() => setSourceType('transcript')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                sourceType === 'transcript' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <AlignLeft className="h-4 w-4" /> Paste Transcript
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-2">
            {sourceType === 'youtube' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="youtube-url" className="block text-xs font-semibold text-slate-300">YouTube Video URL</label>
                  <input 
                    id="youtube-url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  />
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-slate-400 text-xs flex gap-2">
                  <Info className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" />
                  <span>Our AI engine leverages Gemini's search grounding and analysis capabilities to extract quotes, themes, and detailed key takeaways from this public video link.</span>
                </div>
              </div>
            )}

            {sourceType === 'file' && (
              <div className="space-y-4">
                <div 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragActive ? 'border-orange-500 bg-orange-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
                  }`}
                >
                  <input 
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="text/*,application/json,audio/*,video/*"
                    onChange={handleFileChange}
                  />
                  {fileName ? (
                    <div className="space-y-2">
                      <FileText className="h-10 w-10 text-orange-500 mx-auto" />
                      <p className="text-slate-200 font-semibold text-sm">{fileName}</p>
                      <p className="text-slate-500 text-xs">{(fileMimeType || 'Unknown format')}</p>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFileName(undefined);
                          setFileBase64(undefined);
                          setFileMimeType(undefined);
                        }} 
                        className="text-red-400 hover:text-red-300 text-xs font-semibold underline mt-2"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-10 w-10 text-slate-600 mx-auto group-hover:text-orange-400" />
                      <p className="text-slate-300 font-semibold text-sm">Drag and drop file here, or click to browse</p>
                      <p className="text-slate-500 text-xs">Supports Text (.txt, .json) and Audio/Video (.mp3, .mp4, etc.) up to 15MB</p>
                    </div>
                  )}
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-slate-400 text-xs flex gap-2">
                  <Info className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" />
                  <span>Media uploads (audio/video) are securely analyzed server-side using Gemini's Native Multimodal processing.</span>
                </div>
              </div>
            )}

            {sourceType === 'transcript' && (
              <div className="space-y-2">
                <label htmlFor="transcript-text" className="block text-xs font-semibold text-slate-300">Paste Video Transcript or Script</label>
                <textarea 
                  id="transcript-text"
                  placeholder="Paste your video transcript, notes, or article content here to repurpose..."
                  value={pastedTranscript}
                  onChange={(e) => setPastedTranscript(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-y font-mono text-xs"
                />
                <div className="flex justify-between items-center text-slate-500 text-[10px] px-1">
                  <span>Minimum 20 characters recommended.</span>
                  <span>{pastedTranscript.length} characters</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Tone & Brand Voice */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold">3</span>
            Tone & Brand Voice
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tone Selector */}
            <div className="space-y-2">
              <label htmlFor="tone-select" className="block text-xs font-semibold text-slate-300">Style / Tone Preset</label>
              <select
                id="tone-select"
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              >
                <option value="Desi / Hinglish">Desi / Hinglish (Tanmay Bhat/Ranveer vibe)</option>
                <option value="Casual & Engaging">Casual & Engaging (Friendly Mentor)</option>
                <option value="Formal / Educational">Formal / Educational (Informative Teacher)</option>
                <option value="Corporate / B2B">Corporate / B2B (Startup/Industry Leader)</option>
              </select>
            </div>

            {/* Brand Voice Dropdown */}
            <div className="space-y-2">
              <label htmlFor="brand-voice-select" className="block text-xs font-semibold text-slate-300">Custom Brand Voice Profile (Optional)</label>
              <select
                id="brand-voice-select"
                value={selectedBrandVoiceId}
                onChange={(e) => setSelectedBrandVoiceId(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              >
                <option value="">No Custom Profile (Use preset only)</option>
                {brandVoices.map(voice => (
                  <option key={voice.id} value={voice.id}>{voice.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Output Formats */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold">4</span>
              Formats to Generate
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <button type="button" onClick={selectAllFormats} className="text-orange-400 hover:text-orange-300">Select All</button>
              <span className="text-slate-700">|</span>
              <button type="button" onClick={deselectAllFormats} className="text-orange-400 hover:text-orange-300">Clear All</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {availableFormats.map(format => {
              const isSelected = selectedFormats.includes(format);
              return (
                <div 
                  key={format}
                  onClick={() => toggleFormat(format)}
                  className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    isSelected ? 'border-orange-600 bg-orange-950/10 text-slate-100' : 'border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-semibold">{format}</span>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-700'
                  }`}>
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Forge Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="text-slate-400 text-xs text-center sm:text-left flex items-center gap-1">
            <span>Estimated Credits Required: </span>
            <span className="text-orange-400 font-bold">{selectedFormats.length} Credits</span>
            <span className="text-slate-600">({credits} available)</span>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-orange-950/20"
          >
            Forge Content Now
          </button>
        </div>

      </form>
    </div>
  );
}
