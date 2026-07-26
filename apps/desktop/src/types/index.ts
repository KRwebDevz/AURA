export type ViewMode = 'mission-control' | 'conversation-focus';

export type AssistantState = 'THINKING' | 'STREAMING' | 'COMPLETE' | 'ERROR';

export type WorkspaceDomain =
  | 'personal'
  | 'trading'
  | 'architecture'
  | 'development'
  | 'business';

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
