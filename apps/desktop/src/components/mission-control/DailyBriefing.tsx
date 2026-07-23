import React from 'react';
import { BriefingData } from '../../types';
import { ExecutiveTimeline } from './ExecutiveTimeline';
import { CloudSun, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface DailyBriefingProps {
  data: BriefingData;
  onSelectPrompt: (prompt: string) => void;
}

export const DailyBriefing: React.FC<DailyBriefingProps> = ({
  data,
  onSelectPrompt,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Dynamic Executive Greeting Header */}
      <div className="bg-[#0F141C] border border-[#1E2638] rounded-md p-6 relative overflow-hidden shadow-sm">
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[11px] font-mono uppercase text-sky-400 tracking-wider flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              AMBIENT BRIEFING • LEVEL 2 ATTENTION
            </span>
            <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
              {data.greeting}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {data.subtitle}
            </p>
          </div>

          <div className="text-right space-y-1 font-mono text-xs text-slate-400 border-l border-[#1E2638] pl-6 hidden sm:block">
            <div className="flex items-center justify-end gap-1.5 text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{data.marketSummary}</span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-slate-400">
              <CloudSun className="w-3.5 h-3.5 text-sky-400" />
              <span>{data.weather}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Executive Timeline + Quick Focus Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Timeline Column (2 Cols) */}
        <div className="md:col-span-2">
          <ExecutiveTimeline items={data.priorities} />
        </div>

        {/* Focus Actions Column (1 Col) */}
        <div className="space-y-4">
          <div className="bg-[#0F141C] border border-[#1E2638] rounded-md p-5 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              Contextual Triggers
            </h3>
            <div className="space-y-2">
              <button
                onClick={() =>
                  onSelectPrompt('Prepare me for Capgemini meeting')
                }
                className="w-full text-left bg-[#161B26] hover:bg-[#1E2433] border border-[#1E2638] hover:border-[#334155] p-3 rounded-sm text-xs transition-colors"
              >
                <div className="font-medium text-slate-200">
                  Capgemini Briefing Prep
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Summarize key agenda & architectural points
                </div>
              </button>

              <button
                onClick={() => onSelectPrompt('Review Sutr quotation files')}
                className="w-full text-left bg-[#161B26] hover:bg-[#1E2433] border border-[#1E2638] hover:border-[#334155] p-3 rounded-sm text-xs transition-colors"
              >
                <div className="font-medium text-slate-200">
                  Sutr Quotation Approval
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Check client drawings and pending quotes
                </div>
              </button>

              <button
                onClick={() => onSelectPrompt('Setup NY trading session workspace')}
                className="w-full text-left bg-[#161B26] hover:bg-[#1E2433] border border-[#1E2638] hover:border-[#334155] p-3 rounded-sm text-xs transition-colors"
              >
                <div className="font-medium text-slate-200">
                  Trading Session Staging
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
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
