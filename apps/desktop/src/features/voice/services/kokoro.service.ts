import { KokoroVoice, VoiceGender, VoiceAccent } from '../../../types';

const KOKORO_BASE_URL = 'http://localhost:8880';
const HEALTH_TIMEOUT_MS = 2000;
const SYNTHESIS_TIMEOUT_MS = 15000;

// ─── Curated Voice Metadata ─────────────────────────────────────
// Kokoro voice IDs follow the pattern: {accent}{gender}_{name}
//   a = American, b = British
//   f = female,   m = male
//
// This catalog enriches raw IDs with hand-curated descriptions.
// Unknown voices get auto-generated metadata from ID parsing.

interface VoiceCatalogEntry {
  displayName: string;
  description: string;
  recommended?: boolean;
}

const VOICE_CATALOG: Record<string, VoiceCatalogEntry> = {
  // ── American Female ──
  af_bella:   { displayName: 'Bella',   description: 'Calm • Professional • Warm',     recommended: true },
  af_sarah:   { displayName: 'Sarah',   description: 'Composed • Clear • Authoritative' },
  af_nicole:  { displayName: 'Nicole',  description: 'Smooth • Confident • Modern' },
  af_sky:     { displayName: 'Sky',     description: 'Light • Energetic • Bright' },
  af_heart:   { displayName: 'Heart',   description: 'Gentle • Empathetic • Soft' },
  af_jessica: { displayName: 'Jessica', description: 'Polished • Sharp • Direct' },
  af_river:   { displayName: 'River',   description: 'Natural • Flowing • Relaxed' },
  af_alloy:   { displayName: 'Alloy',   description: 'Clean • Neutral • Versatile' },
  af_aoede:   { displayName: 'Aoede',   description: 'Rich • Melodic • Expressive' },

  // ── American Male ──
  am_adam:    { displayName: 'Adam',    description: 'Deep • Commanding • Executive',   recommended: true },
  am_michael: { displayName: 'Michael', description: 'Steady • Trustworthy • Measured' },
  am_echo:    { displayName: 'Echo',    description: 'Clear • Resonant • Balanced' },
  am_eric:    { displayName: 'Eric',    description: 'Warm • Approachable • Confident' },
  am_liam:    { displayName: 'Liam',    description: 'Young • Dynamic • Articulate' },
  am_onyx:    { displayName: 'Onyx',    description: 'Deep • Rich • Powerful' },
  am_puck:    { displayName: 'Puck',    description: 'Playful • Quick • Spirited' },
  am_santa:   { displayName: 'Santa',   description: 'Warm • Jovial • Friendly' },

  // ── British Female ──
  bf_emma:     { displayName: 'Emma',     description: 'Refined • Poised • Elegant' },
  bf_isabella: { displayName: 'Isabella', description: 'Sophisticated • Graceful • Crisp' },
  bf_alice:    { displayName: 'Alice',    description: 'Bright • Articulate • Precise' },
  bf_lily:     { displayName: 'Lily',     description: 'Soft • Gentle • Thoughtful' },

  // ── British Male ──
  bm_george: { displayName: 'George', description: 'Classic • Authoritative • Stately' },
  bm_lewis:  { displayName: 'Lewis',  description: 'Composed • Measured • Professional' },
  bm_daniel: { displayName: 'Daniel', description: 'Modern • Clear • Versatile' },
  bm_fable:  { displayName: 'Fable',  description: 'Narrative • Warm • Storytelling' },
};

// ─── Service ────────────────────────────────────────────────────

export class KokoroService {
  private static cachedVoices: KokoroVoice[] | null = null;

  /**
   * Checks if the Kokoro FastAPI server is reachable.
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${KOKORO_BASE_URL}/v1/audio/voices`, {
        method: 'GET',
        signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Fetches the list of available voices from Kokoro and enriches
   * each with curated metadata (displayName, gender, accent, description).
   * Returns cached voices if available; pass `forceRefresh` to bypass cache.
   */
  static async fetchVoices(forceRefresh = false): Promise<KokoroVoice[]> {
    if (this.cachedVoices && !forceRefresh) {
      return this.cachedVoices;
    }

    try {
      const response = await fetch(`${KOKORO_BASE_URL}/v1/audio/voices`, {
        method: 'GET',
        signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
      });

      if (!response.ok) {
        return this.cachedVoices ?? [];
      }

      const data = await response.json();

      // Extract raw IDs from various response shapes
      let rawIds: string[] = [];

      if (Array.isArray(data)) {
        rawIds = data.map((v: string | { id: string }) =>
          typeof v === 'string' ? v : v.id,
        );
      } else if (data?.voices && Array.isArray(data.voices)) {
        rawIds = data.voices.map((v: string | { id: string }) =>
          typeof v === 'string' ? v : v.id,
        );
      }

      // Enrich each raw ID into a full KokoroVoice with metadata
      const enriched = rawIds.map((id) => this.enrichVoice(id));

      // Sort: recommended first, then alphabetical by displayName
      enriched.sort((a, b) => {
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        return a.displayName.localeCompare(b.displayName);
      });

      this.cachedVoices = enriched;
      return enriched;
    } catch {
      return this.cachedVoices ?? [];
    }
  }

  /**
   * Synthesizes speech via Kokoro and returns the raw audio ArrayBuffer.
   */
  static async synthesize(
    text: string,
    voice: string,
    speed = 1.0,
  ): Promise<ArrayBuffer> {
    const response = await fetch(`${KOKORO_BASE_URL}/v1/audio/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(SYNTHESIS_TIMEOUT_MS),
      body: JSON.stringify({
        model: 'kokoro',
        input: text,
        voice,
        speed,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      throw new Error(`Kokoro synthesis failed: ${response.status}`);
    }

    return response.arrayBuffer();
  }

  /**
   * Clears the cached voice list.
   */
  static clearCache(): void {
    this.cachedVoices = null;
  }

  // ─── Private Helpers ────────────────────────────────────────

  /**
   * Enriches a raw Kokoro voice ID into a full KokoroVoice with metadata.
   * Uses the curated catalog when available, falls back to auto-generated metadata.
   */
  private static enrichVoice(id: string): KokoroVoice {
    const catalog = VOICE_CATALOG[id];
    const parsed = this.parseVoiceId(id);

    return {
      id,
      displayName: catalog?.displayName ?? parsed.displayName,
      gender: parsed.gender,
      accent: parsed.accent,
      language: 'English',
      description: catalog?.description ?? parsed.fallbackDescription,
      recommended: catalog?.recommended ?? false,
    };
  }

  /**
   * Parses a Kokoro voice ID to extract gender, accent, and a fallback display name.
   *
   * Kokoro IDs follow the pattern: {accent_code}{gender_code}_{name}
   *   accent_code: a = American, b = British
   *   gender_code: f = female,   m = male
   */
  private static parseVoiceId(id: string): {
    gender: VoiceGender;
    accent: VoiceAccent;
    displayName: string;
    fallbackDescription: string;
  } {
    const parts = id.split('_');
    const prefix = parts[0] ?? '';
    const namePart = parts.slice(1).join(' ');

    // Derive gender from second character: f = female, m = male
    const genderChar = prefix.charAt(1);
    const gender: VoiceGender = genderChar === 'm' ? 'male' : 'female';

    // Derive accent from first character: a = American, b = British
    const accentChar = prefix.charAt(0);
    const accent: VoiceAccent =
      accentChar === 'a' ? 'american' : accentChar === 'b' ? 'british' : 'other';

    // Capitalize the name part
    const displayName = namePart
      ? namePart.charAt(0).toUpperCase() + namePart.slice(1)
      : id;

    // Generate a generic description from parsed attributes
    const accentLabel = accent === 'american' ? 'American' : accent === 'british' ? 'British' : '';
    const genderLabel = gender === 'female' ? 'Female' : 'Male';
    const fallbackDescription = [accentLabel, genderLabel, 'Voice'].filter(Boolean).join(' • ');

    return { gender, accent, displayName, fallbackDescription };
  }
}
