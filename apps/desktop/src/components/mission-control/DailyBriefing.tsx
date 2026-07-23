import React from 'react';
import { BriefingData } from '../../types';
import { ExecutiveTimeline } from './ExecutiveTimeline';
import { Sparkles, Zap } from 'lucide-react';

interface DailyBriefingProps {
  data: BriefingData;
  onSelectPrompt: (prompt: string) => void;
}

export const DailyBriefing: React.FC<DailyBriefingProps> = ({
  data,
  onSelectPrompt,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Executive Briefing Natural Prose Card */}
      <div className="bg-[#0F141C] border border-[#1E2638] rounded-md p-6 relative shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-[#1E2638] pb-3">
          <span className="text-[10px] font-mono uppercase text-sky-400 tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            AMBIENT EXECUTIVE BRIEFING
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            28°C CLEAR • AIR QUALITY NOMINAL
          </span>
        </div>

        {/* Cohesive Executive Paragraph */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            {data.greeting}
          </h1>

          <div className="text-sm text-slate-300 space-y-1.5 leading-relaxed">
            <p>Your Capgemini architecture review begins in 40 minutes.</p>
            <p>Gold ($2,740) and Nifty (24,500) are both trading higher this morning.</p>
            <p className="text-slate-400 text-xs pt-1">
              All core systems are operational and ready for your commands.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Executive Timeline + Contextual Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Timeline Column (2 Cols) */}
        <div className="md:col-span-2">
          <ExecutiveTimeline items={data.priorities} />
        </div>

        {/* Contextual Triggers Column (1 Col) */}
        <div className="space-y-4">
          <div className="bg-[#0F141C] border border-[#1E2638] rounded-md p-5 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              Contextual Triggers
            </h3>
            <div className="space-y-2.5">
              {/* Trigger 1: Priority */}
              <button
                onClick={() =>
                  onSelectPrompt('Prepare me for Capgemini meeting')
                }
                className="w-full text-left bg-[#161B26] hover:bg-[#1E2433] border border-[#1E2638] hover:border-sky-500/40 p-3 rounded-sm text-xs transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                    Capgemini Briefing Prep
                  </span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-red-950/50 text-red-400 border border-red-900/60 rounded-sm font-medium">
                    PRIORITY
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Summarize key agenda & architectural points
                </div>
              </button>

              {/* Trigger 2: Upcoming */}
              <button
                onClick={() => onSelectPrompt('Review Sutr quotation files')}
                className="w-full text-left bg-[#161B26] hover:bg-[#1E2433] border border-[#1E2638] hover:border-sky-500/40 p-3 rounded-sm text-xs transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                    Sutr Quotation Approval
                  </span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-amber-950/50 text-amber-400 border border-amber-900/60 rounded-sm font-medium">
                    UPCOMING
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Check client drawings and pending quotes
                </div>
              </button>

              {/* Trigger 3: Suggested */}
              <button
                onClick={() => onSelectPrompt('Setup NY trading session workspace')}
                className="w-full text-left bg-[#161B26] hover:bg-[#1E2433] border border-[#1E2638] hover:border-sky-500/40 p-3 rounded-sm text-xs transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                    Trading Session Staging
                  </span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-sky-950/50 text-sky-400 border border-sky-900/60 rounded-sm font-medium">
                    SUGGESTED
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Load Nifty/Gold volatility levels & risk metrics
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
