import React from 'react';
import { mockSystemTelemetry } from '../../services/mockApi';
import { useAuraStore } from '../../store/useAuraStore';
import { DesktopVoiceManager } from '../../features/voice/voice.manager';
import { Activity, Cpu, Database, Globe, Mic, Settings, Target, Volume2, VolumeX } from 'lucide-react';

export const StatusHud: React.FC = () => {
  const telemetry = mockSystemTelemetry;
  const { isMuted, isSpeaking, toggleMute, viewMode, setViewMode } = useAuraStore();
  const voicePosture = DesktopVoiceManager.getVoiceStatus();

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

        {/* Executive Voice Telemetry (Ready | Speaking | Muted | Offline) */}
        <div className="flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity">
          <Mic className={`w-3 h-3 ${isSpeaking ? 'text-sky-400 animate-bounce' : 'text-slate-500'}`} />
          <span>Voice:</span>
          {isMuted || voicePosture === 'MUTED' ? (
            <span className="text-red-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
              Muted
            </span>
          ) : isSpeaking || voicePosture === 'SPEAKING' ? (
            <span className="text-sky-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping inline-block" />
              Speaking
            </span>
          ) : voicePosture === 'OFFLINE' ? (
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
              Offline
            </span>
          ) : (
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Ready
            </span>
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

      {/* Right side: Mute toggle + Settings Button + Focus Token */}
      <div className="flex items-center gap-3">
        {/* Settings Toggle Button */}
        <button
          onClick={() => setViewMode(viewMode === 'settings' ? 'mission-control' : 'settings')}
          title="Open Voice Settings"
          className={`flex items-center gap-1 px-2 py-0.5 rounded-xs border transition-all ${
            viewMode === 'settings'
              ? 'bg-sky-950/60 border-sky-500/60 text-sky-300'
              : 'bg-[#0F141C] border-[#1E2638] text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
        >
          <Settings className="w-3 h-3 text-sky-400" />
          <span>SETTINGS</span>
        </button>

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
