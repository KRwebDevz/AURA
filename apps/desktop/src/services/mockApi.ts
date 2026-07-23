import {
  BriefingData,
  ConversationMessage,
  SystemHudTelemetry,
} from '../types';

export const mockSystemTelemetry: SystemHudTelemetry = {
  brain: { name: 'Brain', status: 'RUNNING', detail: 'v0.1.0' },
  memory: { name: 'Memory', status: 'READY', detail: 'Context Store' },
  voice: { name: 'Voice', status: 'STANDBY', detail: 'Audio Engine' },
  execution: { name: 'Execution', status: 'ACTIVE', detail: 'Local Runner' },
  network: { name: 'Network', status: 'OLLAMA', detail: '11434' },
  focus: { name: 'Focus: Trading', domain: 'trading' },
};

export const mockBriefingData: BriefingData = {
  greeting: 'Good Morning, Sir.',
  subtitle:
    'Your first executive briefing with Capgemini begins in 40 minutes. All core systems are nominal.',
  priorities: [
    {
      id: '1',
      time: '07:30',
      title: 'Executive Workout & Health Routine',
      subtitle: 'Completed',
      status: 'completed',
    },
    {
      id: '2',
      time: '10:00',
      title: 'Capgemini System Architecture Review',
      subtitle: 'Starts in 40 mins',
      status: 'active',
    },
    {
      id: '3',
      time: '14:00',
      title: 'Sutr Quotation & Client Drawings Approval',
      subtitle: 'Pending Review',
      status: 'upcoming',
    },
    {
      id: '4',
      time: '20:00',
      title: 'NY Market Open & Trading Strategy Session',
      subtitle: 'Focus: Gold & Nifty Volatility',
      status: 'upcoming',
    },
  ],
  marketSummary: 'NIFTY: 24,500 (+0.4%) • GOLD: $2,740 (+0.8%)',
  weather: '28°C Clear • Air Quality Nominal',
  pendingActionsCount: 3,
};

export const mockInitialMessages: ConversationMessage[] = [
  {
    id: 'init-1',
    role: 'aura',
    content:
      'Good morning, Sir. Current system check: All core modules operational. Your 10:00 AM Capgemini briefing notes and Sutr quotation files are staged for your review.',
    timestamp: '09:15 AM',
    model: 'llama3.2',
    provider: 'ollama',
  },
];

export async function fetchDailyBriefing(): Promise<BriefingData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockBriefingData), 100);
  });
}

export async function fetchSystemTelemetry(): Promise<SystemHudTelemetry> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSystemTelemetry), 100);
  });
}

export async function sendMockCommand(
  prompt: string,
): Promise<ConversationMessage> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `msg-${Date.now()}`,
        role: 'aura',
        content: `Sir, I have processed your request for "${prompt}". All requested items have been updated across your active workspace context.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        model: 'llama3.2',
        provider: 'ollama',
      });
    }, 800);
  });
}
