<div align="center">

# BridgeBot

**Autonomous legacy-to-modern code migration engine**

Transform legacy codebases (COBOL, Java 6, Fortran 77, PHP 5.4, Turbo Pascal and more) into modern, idiomatic, memory-safe stacks — powered by **Google Gemini**.

</div>

## What it does

BridgeBot runs a full modernization pipeline over pasted legacy source code or
uploaded files:

1. **Code Extraction & Config** — pick a legacy example, paste a snippet, or
   drag & drop a file (language auto-detected by extension).
2. **Semantic Analysis** — parses the legacy program to surface obsolete
   *anti-patterns* (`GOTO` spaghetti logic, raw thread monitors, SQL injection
   surfaces, manual memory management, etc.).
3. **AI Transformation** — with a `GEMINI_API_KEY` set, Gemini rewrites the code
   into idiomatic target code and returns structured JSON with:
   - **Modernized code** + architectural summary
   - **Refactoring log** (dead code pruning, clean architecture)
   - **Security audit** (patched vulnerabilities with severities)
   - **Unit test suite** and **performance comparison** (LOC, memory, CPU)
4. **Interactive refinement** — chat directly with the agent to refine the
   output ("add timeouts to the concurrent handlers", "add file logging"...).

### Target stacks

Go · Rust · Python 3.12 · TypeScript · Modern C++ · Java 21 · C#/.NET ·
Elixir/Phoenix · React · Next.js · Vue · SvelteKit · SolidJS · Nuxt · Astro ·
Flutter · React Native · SwiftUI · Kotlin Multiplatform — plus any custom stack.

## Graceful fallback (no API key needed)

BridgeBot never crashes without a key. When `GEMINI_API_KEY` is absent, it runs
a **deterministic offline engine** that still produces complete Go / Python /
Rust / TypeScript output, analysis, security audit, tests and performance
metrics. Honest target-aware templates are emitted for other stacks, and the UI
clearly shows **OFFLINE ENGINE** vs **GEMINI API: LIVE** status.

## Getting started

**Prerequisites:** Node.js 18+

```bash
npm install
cp .env.example .env.local   # optional: add your GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

> Without a key the app runs in offline mode; with a key it uses the live
> Gemini API (`gemini-2.0-flash-lite`).

### Production build

```bash
npm run build      # vite build → dist/
npm run lint       # tsc --noEmit type-check
npm run bundle     # esbuild server → dist/server.cjs
npm start          # node dist/server.cjs (serves dist/ + API)
```

## API

| Endpoint        | Body                                                        | Returns                                            |
| --------------- | ----------------------------------------------------------- | -------------------------------------------------- |
| `POST /api/migrate` | `{ sourceCode, sourceLang, targetLang, options[] }`     | Migration result JSON (`_mode: "live" \| "offline"`) |
| `POST /api/refine`  | `{ modernCode, message }`                                | `{ explanation, refinedCode, _mode }`                |

Both endpoints return `400` on missing input and **never** 500 on a failed AI
call — they transparently degrade to the offline engine.

## Deployment (Vercel)

The repo ships with `vercel.json` (serverless function at `api/index.ts`).
Set `GEMINI_API_KEY` in your project's environment variables. No build-time
secrets are committed to the repository.

## Tech stack

React 19 · Vite 6 · Tailwind CSS 4 · Express 4 · `@google/genai` · motion ·
lucide-react · TypeScript.