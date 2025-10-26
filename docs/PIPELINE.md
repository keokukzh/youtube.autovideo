# PIPELINE

End-to-end Datenfluss (geplant):

1. **Script-Generierung** (LLM/Prompt) → `data/script.json`
2. **TTS** (Provider-Adapter) → `assets/voiceover.wav`
3. **Asset-Sourcing** (Bilder/Clips, Lizenznachweise) → `assets/media/*`
4. **Timeline-Erstellung** (Deklaratives JSON) → `data/timeline.json`
5. **Rendering** (Adapter: Remotion/ffmpeg) → `out/video.mp4`
6. **Upload** (YouTube API) → Video-URL

## Formate
- `script.json`: { title, description, sections: [{ id, text, durationHint }] }
- `timeline.json`: { fps, width, height, tracks: [{ type, start, end, src, params }] }

## Fehler & Retry
- Provider-spezifische Fehler abfangen, klassifizieren
- Exponentielles Backoff, maximale Versuche konfigurierbar
- Idempotente Zwischenschritte (Caching)
