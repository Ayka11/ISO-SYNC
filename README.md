# ISO-SYNC — Vibrational Operating System (VOS)

ISO-SYNC is a neuro-wellness project and prototype: a "Vibrational Operating System" (VOS) that explores sonomechanobiology and bio-responsive audio UI. This repository contains a web-based prototype (PWA-capable) that demonstrates core sonic UI concepts using the Web Audio API.

**Quick links:**
- **Project files:** [README-ISO-SYNC.md](README-ISO-SYNC.md)

## Overview

ISO-SYNC treats the body as a resonant system and uses targeted acoustic frequencies to support autonomic balance, focus, and somatic grounding. The app combines:
- Functional Harmonics: every UI interaction emits a purpose-built frequency or interval.
- Biofeedback-ready hooks: prototype code is structured to accept simple microphone/wearable inputs for HRV and breath detection.
- Spatial audio and binaural options for immersive headphone experiences.

The prototype is explicitly a research/experimental wellness tool. It is not a medical device and does not provide diagnostic or treatment claims.

## Core Concepts

- **Solfeggio-inspired tones:** curated mid/high frequencies for subjective effects (e.g., grounding, clarity).
- **Infrasonic foundation (0.1–40 Hz):** used for vagal/breath entrainment and brainwave synchronization.
- **Cross-frequency coupling:** layering gamma (40 Hz) where appropriate to maintain alertness during relaxation.
- **Bio-linguistic intervals:** musical intervals are treated as actionable "verbs" (e.g., perfect fifth = bridge).

## Sound Architecture (high level)

| App Action | Frequency Component | Sonic Description | Intended Effect |
|---|---:|---|---|
| App Launch | 528 Hz + 174 Hz | Warm swell resolving to a shimmering tone | Grounding / calming reset (supportive language only) |
| Task Completed | 963 Hz + 40 Hz | Bright ping with 40 Hz shimmer | Reward-like clarity / brief gamma coupling |
| Error / Alert | Minor second interval | Short dissonant pair | Attention signal / quick system reset |
| Deep Work | 10 Hz pulse | Soft rhythmic thrum | Encourage alpha entrainment for focus |
| Vagal Sync | 0.1 Hz modulated sigh | Low-pass filtered cyclical breath guide | Parasympathetic breathing cue (biofeedback-ready)

## Prototype & Implementation Notes

- The prototype uses the Web Audio API to synthesize sine waves, combine frequencies, and create binaural offsets and glissandos.
- Files referenced in the design/prototype examples: `index.html`, `style.css`, `script.js`, and `manifest.json` (the repo includes a single-page React/Vite app; the prototype code shared in design notes can be used as a standalone HTML prototype).
- To run a simple static prototype locally (if you place the sample `index.html` in a folder):

```bash
python -m http.server 8000
# then open http://localhost:8000 in a browser
```

- Important browser note: AudioContext must be unlocked by a user gesture (click/tap) before playing audio.

## Key Features (implemented in prototype)

- Navigation Sound-Bar with glissandos between Solfeggio anchors.
- Vagal Sync hold (3s) that triggers a 0.1 Hz modulated breath cue using filtered noise.
- Playable action tones (launch, complete, error, deep-work, close) and stackable session sequences.
- Modular `SoundEngine` class (prototype JS) designed for easy extension: binaural, coupling, stacking.

## Safety, Privacy & App-Store Guidance

- **No medical claims:** The app must not claim diagnostic or curative effects. All README text and in-app copy should emphasize "wellness support" and experimentation, not medical treatment.
- **Privacy policy:** If accounts or any data collection are enabled, include a clear privacy policy and link it inside Settings/Profile. Document what is collected, why, and how users can delete data.
- **Consent for sensitive data:** If you add HRV/health metrics later, implement explicit consent flows and disclose how metrics are derived (simulated vs measured).
- **Volume & safety defaults:** Cap playback volume to safe ranges (recommended UI cap: 60–70 dB) and provide sensitivity profiles (tinnitus/ear issues).

## Design & Research Notes

- The system adopts conservative language around efficacy: cite sound therapy literature where available and avoid definitive medical statements.
- Stacking protocols, rituals, and "Emergency Frequency Map" are designed as user-facing guides and experimentation recipes; label them clearly as experiential suggestions.

## Next steps

- Add an in-app Privacy Policy and account deletion flow to satisfy app-store requirements.
- If you plan to surface biometrics, integrate real sensors (wearables or secure getUserMedia pipelines) and update disclaimers/regulatory checks.
- Optionally convert the prototype audio engine into a React component or a small library for reuse inside the existing Vite app.

## Contributing

If you want edits to the README, example prototype files, or help building the PWA version and integrating real-time biofeedback, open an issue or PR.

---
*This README was expanded to document the ISO-SYNC concept, prototype guidance, and minimal app-store safety notes. For design assets and longer white papers, see project documentation or request the full source material.*

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
