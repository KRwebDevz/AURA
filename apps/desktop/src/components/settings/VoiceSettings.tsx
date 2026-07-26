import React, { useState } from 'react';
import { useAuraStore } from '../../store/useAuraStore';
import { DesktopVoiceManager } from '../../features/voice/voice.manager';
import { VoiceModeSetting, KokoroVoice } from '../../types';
import {
  Mic,
  Play,
  RotateCcw,
  Sliders,
  Volume2,
  Zap,
  WifiOff,
  Loader2,
  Star,
  Type,
} from 'lucide-react';

const DEFAULT_SAMPLE_TEXT =
  'Good morning, Sir. I am AURA. How may I assist you today?';

export const VoiceSettings: React.FC = () => {
  const { voiceSettings, updateVoiceSettings, isSpeaking, availableVoices, voiceStatus } =
    useAuraStore();
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [sampleText, setSampleText] = useState(DEFAULT_SAMPLE_TEXT);

  const handleModeSelect = (mode: VoiceModeSetting) => {
    updateVoiceSettings({ providerMode: mode });
  };

  const handlePlaySample = async () => {
    const text = sampleText.trim() || DEFAULT_SAMPLE_TEXT;
    setIsPlayingSample(true);
    await DesktopVoiceManager.speak(text);
    setIsPlayingSample(false);
  };

  const handleResetDefaults = () => {
    const defaultVoice =
      availableVoices.length > 0 ? availableVoices[0].id : 'af_bella';
    updateVoiceSettings({
      providerMode: 'auto',
      selectedVoice: defaultVoice,
      speechRate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      autoPlay: true,
      autoFallback: true,
    });
    setSampleText(DEFAULT_SAMPLE_TEXT);
  };

  const isVoicesLoading =
    availableVoices.length === 0 && voiceStatus !== 'OFFLINE';
  const isVoicesOffline =
    availableVoices.length === 0 && voiceStatus === 'OFFLINE';

  const genderLabel = (v: KokoroVoice) =>
    v.gender === 'female' ? 'Female' : 'Male';

  const accentLabel = (v: KokoroVoice) =>
    v.accent === 'american'
      ? 'American'
      : v.accent === 'british'
        ? 'British'
        : 'Other';

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

        {/* 2. Voice Selection — Rich Cards */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Mic className="w-3.5 h-3.5 text-sky-400" />
            AURA Voice Persona
          </label>

          {isVoicesLoading ? (
            <div className="flex items-center gap-3 p-6 bg-[#0F141C] border border-[#1E2638] rounded-lg">
              <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
              <span className="text-xs text-slate-400 font-mono">
                Loading available voices...
              </span>
            </div>
          ) : isVoicesOffline ? (
            <div className="flex items-center gap-3 p-6 bg-[#0F141C] border border-red-900/40 rounded-lg">
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-xs text-slate-400 font-mono">
                Voice server offline — voices unavailable.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {availableVoices.map((v) => {
                const isSelected = voiceSettings.selectedVoice === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => updateVoiceSettings({ selectedVoice: v.id })}
                    className={`group relative p-4 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-sky-950/50 border-sky-500/80 shadow-md shadow-sky-950/40'
                        : 'bg-[#0F141C] border-[#1E2638] hover:border-slate-600 hover:bg-[#111820]'
                    }`}
                  >
                    {/* Recommended Badge */}
                    {v.recommended && (
                      <div className="absolute top-2.5 right-2.5">
                        <Star className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400 fill-sky-400' : 'text-amber-500/70 fill-amber-500/70'}`} />
                      </div>
                    )}

                    {/* Display Name */}
                    <div className={`font-semibold text-sm ${isSelected ? 'text-sky-200' : 'text-slate-200'}`}>
                      {v.displayName}
                    </div>

                    {/* Tags Row: Gender + Accent */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-sky-900/50 text-sky-300'
                          : 'bg-[#1E2638] text-slate-400'
                      }`}>
                        {genderLabel(v)}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-sky-900/50 text-sky-300'
                          : 'bg-[#1E2638] text-slate-400'
                      }`}>
                        {accentLabel(v)}
                      </span>
                    </div>

                    {/* Description */}
                    <div className={`text-[11px] mt-2 leading-relaxed ${
                      isSelected ? 'text-sky-300/80' : 'text-slate-500'
                    }`}>
                      {v.description}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
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

        {/* 4. Voice Preview — Custom Sample Text */}
        <div className="bg-[#0F141C] border border-[#1E2638] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
            <Type className="w-3.5 h-3.5 text-sky-400" />
            Voice Preview
          </div>

          {/* Custom Text Input */}
          <div className="space-y-2">
            <textarea
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder="Type custom text to preview..."
              rows={2}
              className="w-full bg-[#090C10] border border-[#1E2638] rounded-md px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 font-sans resize-none focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 transition-all"
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                {sampleText.length > 0
                  ? `${sampleText.trim().split(/\s+/).length} words`
                  : 'Default sample will be used'}
              </span>
              {sampleText !== DEFAULT_SAMPLE_TEXT && (
                <button
                  onClick={() => setSampleText(DEFAULT_SAMPLE_TEXT)}
                  className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Reset to default
                </button>
              )}
            </div>
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlaySample}
            disabled={isPlayingSample || isSpeaking}
            className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium text-sm border transition-all ${
              isPlayingSample || isSpeaking
                ? 'bg-sky-950/60 border-sky-500/60 text-sky-300 animate-pulse'
                : 'bg-sky-600 hover:bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-900/40'
            }`}
          >
            {isPlayingSample || isSpeaking ? (
              <>
                <Volume2 className="w-4 h-4 text-sky-300 animate-bounce" />
                <span>Playing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Sample</span>
              </>
            )}
          </button>
        </div>

        {/* 5. Toggles */}
        <div className="bg-[#0F141C] border border-[#1E2638] rounded-xl p-6 space-y-4">
          {/* Streaming Voice Playback */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={voiceSettings.streamingVoice}
              onChange={(e) =>
                updateVoiceSettings({ streamingVoice: e.target.checked })
              }
              className="w-4 h-4 rounded border-[#1E2638] bg-[#090C10] text-sky-500 focus:ring-sky-500"
            />
            <div>
              <span className="text-sm font-medium text-slate-200 block">
                Streaming Voice Playback
              </span>
              <span className="text-xs text-slate-400 block">
                Start speaking sentences in real-time as they generate from the LLM.
              </span>
            </div>
          </label>

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
      </div>
    </div>
  );
};
