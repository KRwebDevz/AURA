export type ViewMode = 'mission-control' | 'conversation-focus';

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
  role: 'user' | 'aura';
  content: string;
  timestamp: string;
  model?: string;
  provider?: string;
  presenceState?: string;
}
