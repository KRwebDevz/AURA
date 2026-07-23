import React from 'react';
import { mockSystemTelemetry } from '../../services/mockApi';
import { Activity, Cpu, Database, Globe, Mic, Target } from 'lucide-react';

export const StatusHud: React.FC = () => {
  const telemetry = mockSystemTelemetry;

  return (
    <div className="h-8 bg-[#090C10] border-b border-[#1E2638] px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none shrink-0 overflow-x-auto">
      <div className="flex items-center gap-4">
        {/* Brain */}
        <div className="flex items-center gap-1.5 bg-[#0F141C] border border-[#1E2638] px-2 py-0.5 rounded-sm">
          <Cpu className="w-3 h-3 text-sky-400" />
          <span className="text-slate-300 font-medium">
            {telemetry.brain.name}:
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            {telemetry.brain.status}
          </span>
        </div>

        {/* Memory */}
        <div className="flex items-center gap-1.5 bg-[#0F141C] border border-[#1E2638] px-2 py-0.5 rounded-sm">
          <Database className="w-3 h-3 text-slate-400" />
          <span className="text-slate-300 font-medium">
            {telemetry.memory.name}:
          </span>
          <span className="text-sky-400">{telemetry.memory.status}</span>
        </div>

        {/* Voice */}
        <div className="flex items-center gap-1.5 bg-[#0F141C] border border-[#1E2638] px-2 py-0.5 rounded-sm">
          <Mic className="w-3 h-3 text-slate-500" />
          <span className="text-slate-300 font-medium">
            {telemetry.voice.name}:
          </span>
          <span className="text-slate-400">{telemetry.voice.status}</span>
        </div>

        {/* Execution */}
        <div className="flex items-center gap-1.5 bg-[#0F141C] border border-[#1E2638] px-2 py-0.5 rounded-sm">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span className="text-slate-300 font-medium">
            {telemetry.execution.name}:
          </span>
          <span className="text-emerald-400">{telemetry.execution.status}</span>
        </div>

        {/* Network */}
        <div className="flex items-center gap-1.5 bg-[#0F141C] border border-[#1E2638] px-2 py-0.5 rounded-sm">
          <Globe className="w-3 h-3 text-sky-400" />
          <span className="text-slate-300 font-medium">
            {telemetry.network.name}:
          </span>
          <span className="text-slate-300">
            {telemetry.network.status} ({telemetry.network.detail})
          </span>
        </div>
      </div>

      {/* Focus Adaptive Token */}
      <div className="flex items-center gap-1.5 bg-sky-950/40 border border-sky-800/60 text-sky-300 px-2.5 py-0.5 rounded-sm font-semibold tracking-wide">
        <Target className="w-3 h-3 text-sky-400" />
        <span>{telemetry.focus.name.toUpperCase()}</span>
      </div>
    </div>
  );
};
