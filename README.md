# SaaS Intelligence Engine

AI-powered competitive research & market analysis for any SaaS product  10-step pipeline in one click.

[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646cff)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## What It Does

Enter any SaaS product name or idea and get a full intelligence report in seconds:

- **10-step AI pipeline**: Web Crawl → X/Twitter → Reddit → Product Hunt → LinkedIn → G2 Reviews → ICP → Market Sizing → Competitors → Synthesis
- **10-tab report dashboard**: Overview, Sources, ICP, Market, Competition, SWOT, Pricing, GTM, Ask AI, Full Report
- **Multi-provider AI**: Anthropic Claude, Groq (Llama), Google Gemini, OpenAI, Mistral  auto-detected from key format
- **Export**: PDF and HTML report export
- **Save & compare** multiple reports in-session
- **Ask AI tab**: Conversational follow-up grounded in your research data
- **Fully responsive**: Desktop, tablet, and mobile

---

## Architecture

```
saas-intelligence-engine/
├── public/
│   └── favicon.svg          # SVG favicon (matches navbar logo)
├── src/
│   ├── components/ui/       # shadcn/ui component library
│   ├── hooks/               # Custom React hooks
│   ├── lib/utils.ts         # Utility functions
│   ├── pages/
│   │   ├── Index.tsx        # Main application (single-page)
│   │   └── NotFound.tsx     # 404 page
│   ├── App.tsx              # Router + providers
│   └── main.tsx             # Entry point
├── .env.example             # Environment variable template
├── index.html               # HTML shell with meta/favicon
└── vite.config.ts
```

**No backend.** All AI calls are made directly from the browser to the respective AI provider APIs.

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- At least one AI provider API key

### Install & Run

```bash
git clone https://github.com/MuhammadTanveerAbbas/saas-intelligence-engine.git
cd saas-intelligence-engine
pnpm install
cp .env.example .env.local
# Edit .env.local  add your VITE_DEFAULT_GROQ_API_KEY
pnpm dev
```

Open [http://localhost:8080](http://localhost:8080).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_DEFAULT_GROQ_API_KEY` | Optional | Pre-fills a default Groq key so users can run research without entering their own key. Get one free at [console.groq.com](https://console.groq.com). |

> All variables must be prefixed with `VITE_` to be exposed to the browser by Vite.

---

## AI Provider Setup

The app auto-detects your provider from the API key format:

| Provider | Key Format | Model Used | Web Search |
|---|---|---|---|
| Anthropic | `sk-ant-...` | claude-sonnet-4 | Yes (native) |
| Groq | `gsk_...` | llama-3.3-70b-versatile | No (training data) |
| Google Gemini | `AIza...` | gemini-2.0-flash | Yes (native) |
| OpenAI | `sk-proj-...` / `sk-...` | gpt-4o-mini | No |
| Mistral | other | mistral-small-latest | No |

Providers with native web search (Anthropic, Gemini) produce more accurate, up-to-date results.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server on port 8080 |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests (Vitest) |

---

## Deployment

### Vercel (recommended)

```bash
pnpm build
# or connect your GitHub repo to Vercel  zero config needed
```

Set `VITE_DEFAULT_GROQ_API_KEY` in your Vercel project environment variables.

### Netlify

```bash
pnpm build
# Publish directory: dist
```

### Docker / Self-hosted

```bash
pnpm build
# Serve the dist/ folder with any static file server
npx serve dist
```

---

## Security Notes

- API keys entered in the UI are stored only in React component state  never persisted to localStorage or sent to any backend.
- The `VITE_DEFAULT_GROQ_API_KEY` env variable is embedded in the client bundle at build time. Use a restricted key with rate limits for public deployments.
- All AI API calls go directly from the user's browser to the respective provider.

---

## Author

Muhammad Tanveer Abbas  [themvpguy.vercel.app](https://themvpguy.vercel.app/)

- X: [@m_tanveerabbas](https://x.com/m_tanveerabbas)
- LinkedIn: [muhammadtanveerabbas](https://linkedin.com/in/muhammadtanveerabbas)
- GitHub: [muhammadtanveerabbas](https://github.com/muhammadtanveerabbas)

---

## License

[MIT](./LICENSE)
