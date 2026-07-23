import React from 'react';
import { mockSystemTelemetry } from '../../services/mockApi';
import { Activity, Cpu, Database, Globe, Mic, Target } from 'lucide-react';

export const StatusHud: React.FC = () => {
  const telemetry = mockSystemTelemetry;

  return (
    <div className="h-7 bg-[#090C10] border-b border-[#1E2638]/60 px-4 flex items-center justify-between text-[10px] font-mono text-slate-500 select-none shrink-0 overflow-x-auto">
      <div className="flex items-center gap-3">
        {/* Brain */}
        <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
          <Cpu className="w-3 h-3 text-slate-400" />
          <span>Brain:</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse inline-block" />
            {telemetry.brain.status}
          </span>
        </div>

        <span className="text-slate-700">•</span>

        {/* Memory */}
        <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
          <Database className="w-3 h-3 text-slate-500" />
          <span>Memory:</span>
          <span className="text-slate-300">{telemetry.memory.status}</span>
        </div>

        <span className="text-slate-700">•</span>

        {/* Voice */}
        <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
          <Mic className="w-3 h-3 text-slate-600" />
          <span>Voice:</span>
          <span className="text-slate-400">{telemetry.voice.status}</span>
        </div>

        <span className="text-slate-700">•</span>

        {/* Execution */}
        <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
          <Activity className="w-3 h-3 text-emerald-500/80" />
          <span>Execution:</span>
          <span className="text-emerald-400">{telemetry.execution.status}</span>
        </div>

        <span className="text-slate-700">•</span>

        {/* Network */}
        <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
          <Globe className="w-3 h-3 text-slate-500" />
          <span>Network:</span>
          <span className="text-slate-400">OLLAMA</span>
        </div>
      </div>

      {/* Focus Token */}
      <div className="flex items-center gap-1 text-sky-400/90 font-medium">
        <Target className="w-3 h-3 text-sky-400" />
        <span>FOCUS: TRADING</span>
      </div>
    </div>
  );
};
