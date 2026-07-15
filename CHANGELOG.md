# Changelog

## v1.0.0 — Release Candidate (2026-07-15)

### Architecture
- Monorepo with pnpm workspace (10 engine packages, 3 apps, 1 backend)
- 57 shared TypeScript type definitions
- Engine layer completely decoupled from presentation layer

### Engines
- **character-engine**: LUNA profile, 3 forms (graduation/live/CEO), state management, sprite loading
- **animation-engine**: Music-driven state machine (idle→sing→dance→happy→bow), transition effects, particle system
- **audio-engine**: BPM/volume/beat/energy analysis, file validation, upload management
- **ai-engine**: Personality system (warm_music_dreamer), dialogue engine (20+ scenes), memory system, growth system (Lv1-4)
- **story-engine**: 6 easter egg triggers (first meet, first song, consecutive plays, birthday, night visit, star button)
- **world-engine**: Scene management (school/live/office), weather system, time system, event bus
- **live2d-engine**: Cubism model loader interface, motion/expression controllers
- **pixi-engine**: PixiJS renderer, character renderer, particle system, camera
- **ui-system**: 11 Vue components, 63 CSS design tokens, composable theme system
- **shared-types**: 57 interfaces/types across 8 domains

### Web Client
- 7 pages: Home, Music, Character, Memory, Setting, Performance, Chat
- Chapter 0 first-meet storyline with typewriter effect
- Canvas 2D pixel character with 3 form variants
- Web Audio API playback with BPM/energy analysis
- Starfield particle background
- Room with interactive furniture
- AI dialogue with scene detection and memory context
- Memory timeline with milestones
- Personalized nickname greeting
- Welcome-back flow with day counter
- Settings: nickname, data export, clear data, replay intro

### Backend
- 17 REST API endpoints (User/Music/Character/Memory/AI/Growth)
- 6 MongoDB schemas (users/characters/songs/memories/stories/growth)
- COS storage service
- JWT auth middleware
- 5 CloudBase cloud functions

### Testing
- 5 test files, 38 test cases, 0 failures
- CharacterEngine, AnimationStateMachine, DialogueEngine, MemorySystem, StorySystem, AudioAnalyzer, FileValidator, SceneManager, WeatherSystem, TimeSystem, WorldEventBus
- Vitest + Playwright config
- GitHub Actions CI/CD

### Assets
- Character Bible (full identity reference)
- Character DNA JSON (57 trait parameters)
- Asset Manifest (36 targets tracked)
- 18 sprite JSON configs (3 forms × 6 animations)
- Art Production Guide (8 AI generation prompts)

### DevOps
- Git: 10 commits on develop, Conventional Commits
- GitHub: https://github.com/XL617726/LUNA
- Build: 83 modules, 1.20s production build
---
