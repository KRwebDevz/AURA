export type ViewMode = 'mission-control' | 'conversation-focus' | 'settings';

export type AssistantState = 'THINKING' | 'STREAMING' | 'COMPLETE' | 'ERROR';

export type WorkspaceDomain =
  | 'personal'
  | 'trading'
  | 'architecture'
  | 'development'
  | 'business';

export type VoiceModeSetting = 'auto' | 'kokoro-only' | 'webspeech-only';

export interface VoiceSettingsConfig {
  providerMode: VoiceModeSetting;
  selectedVoice: string; // Dynamic — populated from Kokoro voices API
  speechRate: number;    // 0.5 to 2.0 (default 1.0)
  pitch: number;         // 0.5 to 1.5 (default 1.0)
  volume: number;        // 0 to 1.0 (default 1.0)
  autoPlay: boolean;     // true/false
  autoFallback: boolean; // true/false
  streamingVoice: boolean; // true/false (default true)
}

export interface SubsystemTelemetry {
  name: string;
  status: 'RUNNING' | 'READY' | 'STANDBY' | 'ACTIVE' | 'OLLAMA';
  detail?: string;
  accentColor?: string;
}

export interface SystemHudTelemetry {
  brain: SubsystemTelemetry;
  memory: SubsystemTelemetry;
  voice: SubsystemTelemetry;
  execution: SubsystemTelemetry;
  network: SubsystemTelemetry;
  focus: {
    name: string;
    domain: WorkspaceDomain;
  };
}

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  status: 'completed' | 'active' | 'upcoming';
}

export interface BriefingData {
  greeting: string;
  subtitle: string;
  priorities: TimelineItem[];
  marketSummary: string;
  weather: string;
  pendingActionsCount: number;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  status: 'sending' | 'sent' | 'error';
  isStreaming?: boolean;
  model?: string;
  provider?: string;
}

export interface ConversationSession {
  id: string;
  messages: ConversationMessage[];
}

export interface BackendConversationResponse {
  id: string;
  message: string;
  provider: string;
  model: string;
}

export interface StreamChunkPayload {
  id: string;
  chunk: string;
  done: boolean;
  model?: string;
  provider?: string;
  error?: string;
}

export type VoiceStatusPosture = 'READY' | 'SPEAKING' | 'MUTED' | 'OFFLINE';

export type VoiceGender = 'female' | 'male';
export type VoiceAccent = 'american' | 'british' | 'other';

export interface KokoroVoice {
  id: string;
  displayName: string;
  gender: VoiceGender;
  accent: VoiceAccent;
  language: string;
  description: string;
  recommended: boolean;
}

