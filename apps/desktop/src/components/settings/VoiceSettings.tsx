import React, { useState } from 'react';
import { useAuraStore } from '../../store/useAuraStore';
import { DesktopVoiceManager } from '../../features/voice/voice.manager';
import { VoiceModeSetting } from '../../types';
import {
  Mic,
  Play,
  RotateCcw,
  Sliders,
  Volume2,
  Zap,
} from 'lucide-react';

export const VoiceSettings: React.FC = () => {
  const { voiceSettings, updateVoiceSettings, isSpeaking } = useAuraStore();
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  const handleModeSelect = (mode: VoiceModeSetting) => {
    updateVoiceSettings({ providerMode: mode });
  };

  const handlePlaySample = async () => {
    setIsPlayingSample(true);
    await DesktopVoiceManager.speak(
      'Good morning, Sir. I am AURA. How may I assist you today?',
    );
    setIsPlayingSample(false);
  };

  const handleResetDefaults = () => {
    updateVoiceSettings({
      providerMode: 'auto',
      selectedVoice: 'af_bella',
      speechRate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      autoPlay: true,
      autoFallback: true,
    });
  };

  return (
    <div className="flex-1 bg-[#090C10] text-slate-200 p-8 overflow-y-auto font-sans select-none">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-950/60 border border-sky-800/50 flex items-center justify-center text-sky-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-wide text-slate-100">
                Voice & Audio Settings
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Configure AURA speech synthesis, provider routing, and voice identity.
              </p>
            </div>
          </div>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md border border-[#1E2638] bg-[#0F141C] text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        {/* 1. Provider Mode Selection */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            Voice Provider Mode
          </label>
          <div className="grid grid-cols-3 gap-4">
            {/* Automatic */}
            <div
              onClick={() => handleModeSelect('auto')}
              className={`cursor-pointer p-4 rounded-lg border transition-all ${
                voiceSettings.providerMode === 'auto'
                  ? 'bg-sky-950/40 border-sky-500/80 text-sky-200 shadow-md shadow-sky-950/50'
                  : 'bg-[#0F141C] border-[#1E2638] text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-slate-200">Automatic</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-300">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Uses local Kokoro TTS when online, falling back to OS WebSpeech.
              </p>
            </div>

            {/* Kokoro Only */}
            <div
              onClick={() => handleModeSelect('kokoro-only')}
              className={`cursor-pointer p-4 rounded-lg border transition-all ${
                voiceSettings.providerMode === 'kokoro-only'
                  ? 'bg-sky-950/40 border-sky-500/80 text-sky-200 shadow-md shadow-sky-950/50'
                  : 'bg-[#0F141C] border-[#1E2638] text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-slate-200">Kokoro Only</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  Local Neural
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Strictly uses local Kokoro engine. Reports Offline if server is unavailable.
              </p>
            </div>

            {/* WebSpeech Only */}
            <div
              onClick={() => handleModeSelect('webspeech-only')}
              className={`cursor-pointer p-4 rounded-lg border transition-all ${
                voiceSettings.providerMode === 'webspeech-only'
                  ? 'bg-sky-950/40 border-sky-500/80 text-sky-200 shadow-md shadow-sky-950/50'
                  : 'bg-[#0F141C] border-[#1E2638] text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-slate-200">WebSpeech Only</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300">
                  Native OS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Directly uses system native text-to-speech engine.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Voice Selection */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Mic className="w-3.5 h-3.5 text-sky-400" />
            AURA Voice Persona
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'af_bella', name: 'Bella', tag: 'Executive Female' },
              { id: 'af_sarah', name: 'Sarah', tag: 'Calm Female' },
              { id: 'af_emma', name: 'Emma', tag: 'Professional Female' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => updateVoiceSettings({ selectedVoice: v.id })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  voiceSettings.selectedVoice === v.id
                    ? 'bg-sky-950/50 border-sky-500/80 text-sky-200'
                    : 'bg-[#0F141C] border-[#1E2638] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-medium text-sm text-slate-200">{v.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {v.tag}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Audio Modulation Controls */}
        <div className="bg-[#0F141C] border border-[#1E2638] rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            Audio Modulation
          </div>

          {/* Speed */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Speech Speed</span>
              <span className="font-mono text-sky-400">
                {voiceSettings.speechRate.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={voiceSettings.speechRate}
              onChange={(e) =>
                updateVoiceSettings({ speechRate: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-[#1E2638] rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* Pitch */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Voice Pitch</span>
              <span className="font-mono text-sky-400">
                {voiceSettings.pitch.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={voiceSettings.pitch}
              onChange={(e) =>
                updateVoiceSettings({ pitch: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-[#1E2638] rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Output Volume</span>
              <span className="font-mono text-sky-400">
                {Math.round(voiceSettings.volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1.0"
              step="0.05"
              value={voiceSettings.volume}
              onChange={(e) =>
                updateVoiceSettings({ volume: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-[#1E2638] rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>
        </div>

        {/* 4. Toggles & Test Sample */}
        <div className="flex items-center justify-between bg-[#0F141C] border border-[#1E2638] rounded-xl p-6">
          <div className="space-y-4">
            {/* Auto Play */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceSettings.autoPlay}
                onChange={(e) =>
                  updateVoiceSettings({ autoPlay: e.target.checked })
                }
                className="w-4 h-4 rounded border-[#1E2638] bg-[#090C10] text-sky-500 focus:ring-sky-500"
              />
              <div>
                <span className="text-sm font-medium text-slate-200 block">
                  Auto-Play Assistant Speech
                </span>
                <span className="text-xs text-slate-400 block">
                  Automatically speak assistant responses as they complete.
                </span>
              </div>
            </label>

            {/* Auto Fallback */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceSettings.autoFallback}
                onChange={(e) =>
                  updateVoiceSettings({ autoFallback: e.target.checked })
                }
                className="w-4 h-4 rounded border-[#1E2638] bg-[#090C10] text-sky-500 focus:ring-sky-500"
              />
              <div>
                <span className="text-sm font-medium text-slate-200 block">
                  Auto-Fallback Provider
                </span>
                <span className="text-xs text-slate-400 block">
                  Seamlessly fallback to WebSpeech if Kokoro is offline.
                </span>
              </div>
            </label>
          </div>

          {/* Test Voice Sample Button */}
          <button
            onClick={handlePlaySample}
            disabled={isPlayingSample || isSpeaking}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm border transition-all ${
              isPlayingSample || isSpeaking
                ? 'bg-sky-950/60 border-sky-500/60 text-sky-300 animate-pulse'
                : 'bg-sky-600 hover:bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-900/40'
            }`}
          >
            {isPlayingSample || isSpeaking ? (
              <>
                <Volume2 className="w-4 h-4 text-sky-300 animate-bounce" />
                <span>Playing Sample...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Sample</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
