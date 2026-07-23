import React from 'react';
import { TimelineItem } from '../../types';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface ExecutiveTimelineProps {
  items: TimelineItem[];
}

export const ExecutiveTimeline: React.FC<ExecutiveTimelineProps> = ({
  items,
}) => {
  return (
    <div className="bg-[#0F141C] border border-[#1E2638] rounded-md p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-[#1E2638] pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Executive Timeline
        </h3>
        <span className="text-[11px] font-mono text-sky-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          NOW LIVE
        </span>
      </div>

      <div className="space-y-4 relative before:absolute before:left-[47px] before:top-2 before:bottom-2 before:w-[1px] before:bg-[#1E2638]">
        {items.map((item) => {
          const isActive = item.status === 'active';
          const isCompleted = item.status === 'completed';

          return (
            <div
              key={item.id}
              className={`flex items-start gap-4 relative z-10 transition-all ${
                isActive
                  ? 'bg-[#161B26] border border-sky-500/40 p-3 rounded-md shadow-sm'
                  : 'p-1'
              }`}
            >
              {/* Time Badge */}
              <div
                className={`w-14 text-right font-mono text-xs font-medium pt-0.5 shrink-0 ${
                  isActive
                    ? 'text-sky-400 font-bold'
                    : isCompleted
                      ? 'text-slate-500 line-through'
                      : 'text-slate-300'
                }`}
              >
                {item.time}
              </div>

              {/* Status Icon Indicator */}
              <div className="shrink-0 pt-0.5 bg-[#0F141C] rounded-full">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isActive ? (
                  <PlayCircle className="w-4 h-4 text-sky-400 animate-pulse" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-500" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs font-medium truncate ${
                      isActive
                        ? 'text-slate-100 font-semibold'
                        : isCompleted
                          ? 'text-slate-400 line-through'
                          : 'text-slate-200'
                    }`}
                  >
                    {item.title}
                  </h4>
                  {isActive && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-sky-500/10 text-sky-300 border border-sky-500/30 rounded-sm">
                      IN PROGRESS
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
