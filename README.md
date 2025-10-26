# youtube.autovideo

Automatisierte Pipeline zum Erzeugen von YouTube-Videos aus Skripten/Prompts: Script → TTS → Assets → Schnitt/Render → Upload.

> **Status:** Bootstrap-Setup (Tooling, CI, Templates). Funktionale Pipeline folgt in getrennten Issues/PRs.

## Features (geplant)
- CLI mit Subcommands (`init`, `generate`, `render`, `upload`)
- TTS-Integration (austauschbare Provider)
- Asset-Pipeline (Bilder/Clips, Lizenz-Quellen dokumentiert)
- Deklaratives Timeline-Format (JSON) für Rendering (Remotion/ffmpeg-Adapter)
- YouTube-Upload inkl. OAuth, Token-Refresh & Quoten-Backoff

## Quickstart
```bash
# Node-Version per nvm übernehmen
nvm use

# Abhängigkeiten
npm install

# Lint & Tests
npm run lint
npm test

# CLI-Hilfe
npm run dev -- --help
```

## Konfiguration
- `.env` (lokal) auf Basis von `.env.example` anlegen
- Zentrales Laden/Validieren in `src/config.js` (WIP)

## Projektstruktur
```
.github/
  ISSUE_TEMPLATE/
  workflows/ci.yml
docs/
  PIPELINE.md
src/
  index.js (CLI-Einstieg)
.env.example
.editorconfig
.eslintrc.cjs
.nvmrc
package.json
README.md
```

## Entwicklung
- ESLint + Prettier sind eingerichtet
- Vitest als Test-Runner
- GitHub Actions CI: Install, Lint, Test

## Links
- Siehe auch vorhandene Docs: `UI_UX_AGENT_SETUP.md`, `debug-setup.md`, `IMPLEMENTATION_COMPLETE.md`, `DEBUGGING_COMPLETE.md`, `DEPLOYMENT.md`
