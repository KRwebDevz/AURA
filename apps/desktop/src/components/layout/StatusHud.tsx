import React from 'react';
import { mockSystemTelemetry } from '../../services/mockApi';
import { useAuraStore } from '../../store/useAuraStore';
import { Activity, Cpu, Database, Globe, Mic, Target, Volume2, VolumeX } from 'lucide-react';

export const StatusHud: React.FC = () => {
  const telemetry = mockSystemTelemetry;
  const { isMuted, isSpeaking, toggleMute } = useAuraStore();

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

        {/* Voice Subsystem */}
        <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
          <Mic className={`w-3 h-3 ${isSpeaking ? 'text-sky-400 animate-bounce' : 'text-slate-500'}`} />
          <span>Voice:</span>
          {isMuted ? (
            <span className="text-red-400 font-medium">MUTED</span>
          ) : isSpeaking ? (
            <span className="text-sky-400 font-medium flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-sky-400 animate-ping inline-block" />
              SPEAKING (KOKORO)
            </span>
          ) : (
            <span className="text-slate-400">STANDBY</span>
          )}
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

      {/* Right side: Mute toggle + Focus Token */}
      <div className="flex items-center gap-4">
        {/* Mute/Unmute Toggle Button */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute AURA Voice' : 'Mute AURA Voice'}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-xs border transition-all ${
            isMuted
              ? 'bg-red-950/40 border-red-800/60 text-red-400 hover:bg-red-900/50'
              : 'bg-[#0F141C] border-[#1E2638] text-slate-300 hover:text-sky-300 hover:border-sky-500/40'
          }`}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3 h-3 text-red-400" />
              <span>MUTED</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3 h-3 text-sky-400" />
              <span>AUDIO ON</span>
            </>
          )}
        </button>

        {/* Focus Token */}
        <div className="flex items-center gap-1 text-sky-400/90 font-medium">
          <Target className="w-3 h-3 text-sky-400" />
          <span>FOCUS: TRADING</span>
        </div>
      </div>
    </div>
  );
};
