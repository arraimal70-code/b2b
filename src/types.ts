export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  credits: number;
  creditsUsed: number;
  tier: 'Free' | 'Pro' | 'Ultimate';
  createdAt: string;
}

export interface BrandVoice {
  id: string;
  userId: string;
  name: string;
  sample: string;
  vocabulary: string;
  tone: string;
  rules: string;
  preferredPhrases: string;
  avoidedPhrases: string;
  createdAt: string;
}

export type SourceType = 'youtube' | 'file' | 'transcript';

export interface Project {
  id: string;
  userId: string;
  title: string;
  sourceType: SourceType;
  sourceUrl?: string;
  fileName?: string;
  sourceText?: string;
  tone: string;
  brandVoiceId: string | null;
  formatsSelected: string[];
  status: 'queued' | 'processing' | 'completed' | 'failed';
  outputs: Record<string, string>; // format -> generated text
  errorMsg?: string | null;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  title: string;
  type: 'project_created' | 'project_completed' | 'project_failed' | 'brand_voice_created' | 'credits_topped_up';
  timestamp: string;
}

export interface AIQualityMetric {
  format: string;
  passed: boolean;
  score: number; // 0 to 100
  checks: {
    formatCompliance: boolean;
    sourceGrounding: boolean;
    safetyCheck: boolean;
    lengthBudget: boolean;
    hinglishMarker: boolean;
  };
}
