<div align="center">

# ✈️ IARE Campus Assistant

### *The Official AI-Powered Chatbot for IARE, Hyderabad*

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-43853d?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-FF6F00?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blueviolet?style=for-the-badge)](https://opensource.org/licenses/ISC)

<br/>

> **Instant answers. Zero downtime. IARE-exclusive.**  
> Powered by **Google Gemini 2.0 Flash** with a fully offline knowledge base as automatic fallback.  
> Covers admissions, programs, placements, research, campus life — and much more.

<br/>

---

</div>

## 📑 Table of Contents

- [✨ Overview](#-overview)
- [🚀 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📂 Project Structure](#-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [⚡ Quick Start](#-quick-start)
- [🔑 Environment Variables](#-environment-variables)
- [🎛️ Modes Explained](#️-modes-explained)
- [🌐 API Reference](#-api-reference)
- [📚 Knowledge Base](#-knowledge-base)
- [🔌 Embeddable Widget](#-embeddable-widget)
- [🎨 Frontend & UI](#-frontend--ui)
- [📦 Scripts](#-scripts)
- [☁️ Deployment](#️-deployment)
- [🔒 Security Best Practices](#-security-best-practices)
- [🧩 Extending the Knowledge Base](#-extending-the-knowledge-base)
- [🐛 Troubleshooting](#-troubleshooting)
- [📞 IARE Contact](#-iare-contact)

---

<br/>

## ✨ Overview

The **IARE Campus Assistant** is a full-stack, production-ready AI chatbot built specifically for the [Institute of Aeronautical Engineering (IARE)](https://www.iare.ac.in/), Hyderabad. It serves as a **24/7 digital assistant** for:

- 🎓 Prospective students exploring programs and admissions
- 👨‍🎓 Current students checking portals, exams, and campus services
- 👪 Parents seeking placement records, fees, and hostel info
- 👩‍🏫 Faculty candidates looking to join IARE
- 🏛️ Alumni accessing degree verification and social networks

<br/>

It operates in **two seamlessly integrated modes**:

| Mode | Powered By | Cost | Works Offline? |
|:---:|:---:|:---:|:---:|
| 🤖 **Gemini AI** | Google Gemini 2.0 Flash | Free tier (limited) | ❌ |
| 📚 **Local Knowledge Base** | Static TypeScript data | **Free forever** | ✅ |

The system also ships with an **embeddable JavaScript widget** (`widget.js`) — add the chatbot to any external website with a **single `<script>` tag**.

<br/>

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 🤖 Intelligence
- **Dual-Mode Operation** — Gemini AI or local KB via one env flag
- **Multi-Model Cascade** — auto-tries `gemini-2.0-flash` → `gemini-2.0-flash-lite` → `gemini-1.5-flash`
- **Automatic Fallback** — Rate-limited? Instantly switches to local KB
- **Multi-Turn Conversations** — Remembers last 12 turns of chat history
- **Strict IARE Guardrails** — Refuses all off-topic questions

</td>
<td width="50%">

### 🎨 Design & UX
- **Glassmorphism Dark UI** — IARE-branded, premium feel
- **Interactive FAQ Menu** — 30+ clickable topic chips in local mode
- **Markdown Rendering** — Rich formatted replies with bullets & links
- **Fully Responsive** — Desktop, tablet, and mobile support
- **Smooth Animations** — Slide-up chat, fade transitions

</td>
</tr>
<tr>
<td>

### 🔌 Integration
- **Embeddable Widget** — One `<script>` tag for any website
- **postMessage API** — Cross-iframe secure messaging
- **Quick-Topic Suggestions** — 8 recommended queries on input focus
- **Auto URL Detection** — Widget finds the server URL automatically

</td>
<td>

### ⚡ Performance
- **Instant KB Responses** — Zero API latency in local mode
- **Weighted Search Engine** — Phrase + keyword scoring for best match
- **Hot-Reload Dev Server** — TypeScript recompiles on every save
- **Graceful Error Handling** — User-friendly fallback messages always shown

</td>
</tr>
</table>

<br/>

---

## 🏗️ Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║                       Browser / Client                           ║
║                                                                  ║
║  ┌────────────────────┐        ┌──────────────────────────────┐ ║
║  │   index.html (SPA) │        │  widget.js (Embeddable)      │ ║
║  │   Full chat UI     │        │  Floating bar + modal iframe  │ ║
║  └─────────┬──────────┘        └──────────────┬───────────────┘ ║
║            │ fetch /chat                       │ iframe + postMsg ║
╚════════════╪═══════════════════════════════════╪═════════════════╝
             │                                   │
╔════════════▼═══════════════════════════════════▼═════════════════╗
║              Express Server  —  src/server.ts                    ║
║                     http://localhost:5000                         ║
║                                                                  ║
║   GET  /config        →  mode + topic list                       ║
║   GET  /topic/:id     →  local KB answer by index                ║
║   POST /chat          →  main message processing                 ║
║   Static /            →  serves public/ directory                ║
║                                                                  ║
║  ╔══════════════════════════════════════════════════════════╗   ║
║  ║          routes/chat.ts  (Route Handler)                 ║   ║
║  ║  Validates input → calls askAI() → returns JSON          ║   ║
║  ╚═══════════════════════╤══════════════════════════════════╝   ║
║                          │                                       ║
║  ╔═══════════════════════▼══════════════════════════════════╗   ║
║  ║        services/openaiService.ts  (AI Brain)             ║   ║
║  ║                                                           ║   ║
║  ║   USE_LOCAL_KB = true?                                    ║   ║
║  ║   ├─ YES ──▶ searchKnowledge(message)                    ║   ║
║  ║   └─ NO  ──▶ askGemini() model cascade:                  ║   ║
║  ║               1. gemini-2.0-flash                         ║   ║
║  ║               2. gemini-2.0-flash-lite  (on 429)         ║   ║
║  ║               3. gemini-1.5-flash       (on 429)         ║   ║
║  ║               4. searchKnowledge()      (last resort)    ║   ║
║  ╚═══════════════════════╤══════════════════════════════════╝   ║
║                          │                                       ║
║  ╔═══════════════════════▼══════════════════════════════════╗   ║
║  ║       data/iareKnowledge.ts  (Knowledge Base)            ║   ║
║  ║   30+ topics | Weighted phrase + keyword scoring         ║   ║
║  ╚══════════════════════════════════════════════════════════╝   ║
╚════════════════════════════╪═════════════════════════════════════╝
                             │ (Gemini mode only)
                    ╔════════▼════════╗
                    ║  Google Gemini  ║
                    ║  Free: 30 RPM   ║
                    ║  1,500 req/day  ║
                    ╚═════════════════╝
```

<br/>

---

## 📂 Project Structure

```
ai-chatbot/
│
├── 📁 src/                          # Backend TypeScript source
│   │
│   ├── 📄 server.ts                 # Express app entry point
│   │                                #  • Serves static files from public/
│   │                                #  • GET /config  →  mode + topic list
│   │                                #  • GET /topic/:id  →  KB topic by index
│   │                                #  • Mounts the /chat router
│   │
│   ├── 📁 routes/
│   │   └── 📄 chat.ts               # POST /chat handler
│   │                                #  • Validates that `message` is present
│   │                                #  • Calls askAI(message, history)
│   │                                #  • Returns { reply, source } JSON
│   │
│   ├── 📁 services/
│   │   └── 📄 openaiService.ts      # Core AI brain
│   │                                #  • askAI()        — main export
│   │                                #  • askGemini()    — multi-model cascade
│   │                                #  • localResponse() — KB search wrapper
│   │                                #  • IARE system prompt & safety config
│   │                                #  • Rate-limit detection & retry logic
│   │
│   └── 📁 data/
│       └── 📄 iareKnowledge.ts      # Static knowledge base
│                                    #  • 30+ KBEntry topic objects
│                                    #  • searchKnowledge(query)
│                                    #  • Weighted: phrase (+5) | keyword (+1)
│
├── 📁 public/                       # Frontend static files (served by Express)
│   │
│   ├── 📄 index.html                # Main Chat SPA
│   │                                #  • Calls /config on load to detect mode
│   │                                #  • Gemini mode: conversational text chat
│   │                                #  • Local mode: 30+ clickable FAQ chips
│   │                                #  • Glassmorphism dark-mode IARE design
│   │                                #  • Markdown rendering for bot replies
│   │
│   ├── 📄 widget.js                 # Self-contained embeddable widget
│   │                                #  • Floating input bar (bottom-right)
│   │                                #  • Quick-suggestions popup chips
│   │                                #  • Chat modal with iframe
│   │                                #  • postMessage cross-frame messaging
│   │                                #  • Fully responsive (mobile: 100vw)
│   │
│   └── 📄 demo.html                 # Widget demo & embed-code showcase
│
├── 📄 .env                          # Environment variables (NOT committed)
├── 📄 .gitignore                    # Git ignore rules
├── 📄 package.json                  # npm scripts & dependencies
├── 📄 tsconfig.json                 # TypeScript compiler config
└── 📄 README.md                     # This file
```

<br/>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Version | Purpose |
|:---:|:---:|:---:|:---|
| **Runtime** | ![Node.js](https://img.shields.io/badge/-Node.js-43853d?logo=node.js&logoColor=white&style=flat-square) | v18+ | JavaScript runtime environment |
| **Language** | ![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=white&style=flat-square) | ^5.9 | Type-safe backend development |
| **Framework** | ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white&style=flat-square) | ^5.2 | HTTP server, routing, static files |
| **AI Provider** | ![Google](https://img.shields.io/badge/-Google%20Gemini-FF6F00?logo=google&logoColor=white&style=flat-square) | 2.0 Flash | Conversational AI generation |
| **AI SDK** | `@google/generative-ai` | ^0.24 | Official Gemini client library |
| **Env Config** | `dotenv` | ^17 | `.env` file parsing at startup |
| **CORS** | `cors` | ^2.8 | Cross-origin request support |
| **Dev Server** | `ts-node-dev` | ^2.0 | Hot-reload TypeScript execution |
| **Frontend** | Vanilla HTML/CSS/JS | — | Chat UI — no framework needed |

</div>

<br/>

---

## 📋 Prerequisites

Before running this project, make sure you have:

| Requirement | Minimum | Check With |
|:---:|:---:|:---:|
| **Node.js** | v18+ | `node --version` |
| **npm** | v9+ | `npm --version` |
| **Google Account** | — | For Gemini API key |

> 💡 **Heads up:** A Gemini API key is only needed for AI mode (`USE_LOCAL_KB=false`). If you set `USE_LOCAL_KB=true`, the bot works completely **offline** with no key required.

<br/>

---

## ⚡ Quick Start

### Step 1 — Clone the Repository

```bash
git clone <your-repo-url>
cd ai-chatbot
```

### Step 2 — Install Dependencies

```bash
npm install
```

Installs all packages: `express`, `cors`, `dotenv`, `@google/generative-ai` plus `typescript`, `ts-node-dev`, and type definitions.

<br/>

### Step 3 — Configure Environment

Create a `.env` file in the project root:

```env
# ─────────────────────────────────────────────────────────────
#  Google Gemini API Key
#  Get yours FREE at: https://aistudio.google.com/app/apikey
#  Only required when USE_LOCAL_KB=false
# ─────────────────────────────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key_here

# ─────────────────────────────────────────────────────────────
#  Operation Mode
#  true  → Local KB only (free, offline, instant)
#  false → Google Gemini AI + local KB as fallback (default)
# ─────────────────────────────────────────────────────────────
USE_LOCAL_KB=false

# ─────────────────────────────────────────────────────────────
#  AI Provider
#  gemini → Google Gemini API (default)
#  local  → Force local KB (same effect as USE_LOCAL_KB=true)
# ─────────────────────────────────────────────────────────────
AI_PROVIDER=gemini
```

<br/>

### Step 4 — Start the Dev Server

```bash
npm run dev
```

You'll see:

```
[IARE Bot] 🤖 Mode: AI (provider=GEMINI)
🚀 College AI Chatbot running on http://localhost:5000
```

<br/>

### Step 5 — Open the App

| URL | What You'll See |
|---|---|
| `http://localhost:5000/` | 🗨️ Full chat interface |
| `http://localhost:5000/demo.html` | 🔌 Widget demo page |

<br/>

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
|---|:---:|:---:|---|
| `GEMINI_API_KEY` | Conditional | — | Your Gemini API key. Required only if `USE_LOCAL_KB=false`. Get one free at [aistudio.google.com](https://aistudio.google.com/app/apikey). |
| `USE_LOCAL_KB` | No | `false` | `true` = FAQ-only mode (no AI). `false` = Gemini AI with KB fallback. |
| `AI_PROVIDER` | No | `gemini` | `gemini` for Google Gemini, or `local` to force local KB. |

> ⚠️ **Always restart the server** after editing `.env` — variables are read once at startup.

<br/>

---

## 🎛️ Modes Explained

### 🤖 Gemini AI Mode (`USE_LOCAL_KB=false`)

The default and recommended mode for production. Uses **Google Gemini 2.0 Flash** — Google's fastest generative model.

**Request flow:**

```
User types message
      ↓
POST /chat  { message, history }
      ↓
services/openaiService.ts → askGemini()
      ↓
  Try gemini-2.0-flash
    ├─ ✅ Success → return reply
    └─ ❌ Rate limit (429) → try next model
          ↓
      Try gemini-2.0-flash-lite
        ├─ ✅ Success → return reply
        └─ ❌ Rate limit → try next model
              ↓
          Try gemini-1.5-flash
            ├─ ✅ Success → return reply
            └─ ❌ ALL exhausted → searchKnowledge(message)
                                   (local KB fallback, user informed)
```

**Key facts:**
- Last **12 turns** of conversation history are sent for context
- A detailed **IARE system prompt** grounds every response
- Safety filters block harassment, hate speech, explicit & dangerous content
- Free tier: **30 RPM / 1,500 requests per day**

<br/>

### 📚 Local Knowledge Base Mode (`USE_LOCAL_KB=true`)

For zero-cost, zero-quota, fully offline operation.

**How it works:**
1. Frontend fetches topic list from `GET /config`
2. UI renders 30+ topics as **clickable chips** (no typing required)
3. User clicks → `GET /topic/:id` fetches pre-written answer
4. For typed queries, `searchKnowledge()` scores all topics and returns the best match

**Weighted search scoring:**

```
User query: "what is the placement record at iare"

Entry: "Placements"
  phrases: ["placement record", "campus recruitment"] → +5 each
  keywords: ["placement", "job", "company"]           → +1 each

Score = 5 (phrase: "placement record") + 1 (keyword: "placement") = 6 ✅ WINNER
```

**Best for:** High-traffic periods, quota exhaustion, demos, or production without AI budget.

<br/>

---

## 🌐 API Reference

### `GET /config`

Returns the current operating mode and (in local mode) the full list of topics.

```http
GET http://localhost:5000/config
```

<details>
<summary><b>Response — Gemini mode</b></summary>

```json
{
  "mode": "gemini",
  "topics": []
}
```
</details>

<details>
<summary><b>Response — Local KB mode</b></summary>

```json
{
  "mode": "local",
  "topics": [
    { "id": 0, "topic": "About IARE" },
    { "id": 1, "topic": "Computer Science and Engineering" },
    { "id": 2, "topic": "Aeronautical Engineering" }
  ]
}
```
</details>

<br/>

### `GET /topic/:id`

Fetches a pre-written answer for a specific knowledge base topic.

```http
GET http://localhost:5000/topic/11
```

<details>
<summary><b>Response (200 OK)</b></summary>

```json
{
  "topic": "Placements",
  "answer": "💼 **Placements at IARE**\n\n• 🏆 **91%** of eligible students placed...",
  "source": "local"
}
```
</details>

<details>
<summary><b>Response (404 Not Found)</b></summary>

```json
{ "error": "Topic not found" }
```
</details>

<br/>

### `POST /chat`

The main chat endpoint. Accepts a message and conversation history, returns a reply.

```http
POST http://localhost:5000/chat
Content-Type: application/json
```

**Request Body:**

```json
{
  "message": "What are the placement statistics at IARE?",
  "history": [
    { "role": "user",      "content": "Hello!" },
    { "role": "assistant", "content": "Hi! I'm the IARE Campus Assistant..." }
  ]
}
```

| Field | Type | Required | Description |
|---|---|:---:|---|
| `message` | `string` | ✅ | The user's current message |
| `history` | `array` | No | Previous turns. Each: `{ role: "user"\|"assistant", content: string }`. Last 12 used. |

**Responses:**

| Status | Body | When |
|---|---|---|
| `200 OK` | `{ reply: string, source: "gemini"\|"local" }` | Always on success |
| `400 Bad Request` | `{ error: "Message is required." }` | Empty or missing message |
| `500 Server Error` | `{ error: "Something went wrong..." }` | Unexpected exception |

<br/>

---

## 📚 Knowledge Base

The knowledge base (`src/data/iareKnowledge.ts`) is an array of typed `KBEntry` objects covering every major aspect of IARE.

### Data Structure

```typescript
interface KBEntry {
  topic: string;      // Display name shown in the FAQ menu
  phrases: string[];  // Exact multi-word phrases → +5 points per match
  keywords: string[]; // Individual words        → +1 point per match
  answer: string;     // Pre-written Markdown answer shown to the user
}
```

### All 30+ Topics at a Glance

<details>
<summary><b>Click to expand the full topic list</b></summary>

| # | Topic | Key Phrases |
|---|---|---|
| 0 | ✈️ About IARE | about iare, what is iare, history of iare |
| 1 | 💻 Computer Science & Engineering | cse department, btech cse, ai ml, data science |
| 2 | ✈️ Aeronautical Engineering | aeronautical engineering, uav, wind tunnel |
| 3 | 📡 Electronics & Communication Engg. | ece department, vlsi, embedded systems |
| 4 | ⚡ Electrical & Electronics Engg. | eee department, power systems, drives |
| 5 | ⚙️ Mechanical Engineering | mechanical engineering, manufacturing |
| 6 | 🏗️ Civil Engineering | civil engineering, structural engineering |
| 7 | 🎓 MBA Program | mba program, business administration, icet |
| 8 | 🎓 M.Tech Programs | m.tech, gate admission, pgcet |
| 9 | 🔬 Ph.D Program | phd, doctoral, research degree |
| 10 | 📝 Admissions | how to apply, admission process, eamcet rank |
| 11 | 💼 Placements | placement record, campus recruitment, top companies |
| 12 | 🏭 Internships | summer internship, industrial training, isro |
| 13 | 📚 Library | central library, digital library, ilms |
| 14 | 🏫 Campus Facilities | smart classroom, wifi on campus, infrastructure |
| 15 | 🚌 Bus and Transport | college bus, bus routes, track bus, live gps |
| 16 | 🔬 Research and Innovation | research centers, funded projects, startup park |
| 17 | 📞 Contact IARE | contact iare, phone number, email address |
| 18 | 🏆 Rankings and Accreditation | nirf ranking, naac grade, nba accreditation |
| 19 | 💰 Fees and Scholarships | fee structure, tuition fees, scholarship amount |
| 20 | 📅 Exams, Results & Student Portals | exam schedule, samvidha login, student portal |
| 21 | 🎉 Student Life and Clubs | student clubs, cultural fest, nss, sports |
| 22 | 🖥️ Online Portals & e-Learning | online learning, swayam, nptel, iare videos |
| 23 | 🆘 Women's Helpline & Safety | women helpline, 24x7 helpline, grievance |
| 24 | 🎓 Alumni | iare alumni, degree verification, alumni network |
| 25 | 👩‍🏫 Faculty and Careers at IARE | faculty jobs, teaching jobs, faculty recruitment |
| 26 | 🏠 Hostel and Accommodation | hostel facility, boys hostel, girls hostel |
| 27 | ⚽ Sports & Physical Education | sports at iare, cricket, basketball, gym |
| 28 | 🚫 Anti-Ragging Policy | anti ragging, ragging complaint, ugc helpline |
| 29 | 📅 Academic Calendar | academic calendar, semester dates, holiday list |
| 30 | 🎓 Scholarships & Financial Aid | government scholarship, sc st scholarship, epass |
| 31 | 📋 Grievance Redressal | grievance cell, student complaint, ombudsman |
| 32 | 🤝 NSS & Social Responsibility | nss at iare, blood donation, community service |
| 33 | 🤝 Industry Collaboration & MoUs | mou companies, corporate partnerships |
| 34 | 🛠️ Skill Development & Certifications | aws certification, soft skills, aptitude |
| 35 | ⭐ NAAC Assessment Details | naac grade, naac a++, iqac |

</details>

<br/>

---

## 🔌 Embeddable Widget

The `public/widget.js` is a **zero-dependency, self-contained chatbot widget** that can be embedded in any website.

### Embed in 1 Line

```html
<!-- Add this before </body> in any HTML page -->
<script src="https://your-deployed-domain.com/widget.js"></script>
```

> Replace `your-deployed-domain.com` with your deployed URL. No configuration needed — the widget auto-detects the server origin from its own `<script src>` attribute.

<br/>

### What Appears on the Page

```
┌─────────────────────────────────────────────┐  ← Suggestions popup
│  💡 QUICK QUESTIONS                          │     (appears on focus)
│  [✈️ Aeronautical]  [📝 Admission]          │
│  [💼 Placements]    [🏫 Campus]              │
└─────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐  ← Floating input bar
│ ✈️ │  Ask IARE anything...         │  ➤  │  │     (fixed bottom-right)
└──────────────────────────────────────────────┘
```

When the user sends a message, the chat modal slides up:

```
┌──────────────────────────────┐
│  ✈️  IARE Campus Assistant  ▼│  ← Modal header (click ▼ to close)
│  ● Online · Powered by AI    │
├──────────────────────────────┤
│                              │
│   [iframe → index.html]      │  ← Full chat UI embedded inside
│                              │
└──────────────────────────────┘
```

### Widget Behavior Summary

| Event | Action |
|---|---|
| Click the input field (empty) | Opens the chat modal |
| Type a message + `Enter` | Opens modal + sends message |
| Click ✈️ logo | Opens the chat modal |
| Click a suggestion chip | Fills input + opens modal + sends |
| Click `▼` button | Closes modal |
| Click backdrop overlay | Closes modal |
| Press `Escape` | Closes modal or hides suggestions |

### Quick-Topic Suggestions

| Chip | Query Sent |
|---|---|
| ✈️ Aeronautical Engineering | Aeronautical Engineering |
| 📝 Admission process | Admission process |
| 💼 Placement record | Placement record |
| 🏫 Campus facilities | Campus facilities |
| 🔬 Research opportunities | Research opportunities |
| 📞 Contact IARE | Contact IARE |
| 🎓 M.Tech & MBA | M.Tech & MBA |
| 🚌 Bus facility | Bus facility |

<br/>

---

## 🎨 Frontend & UI

### `public/index.html` — Main Chat SPA

The primary user interface. On every page load, it:

1. Calls `GET /config` to determine mode
2. **Gemini mode** → renders a text input, sends `POST /chat` with message + history, renders bot replies as Markdown
3. **Local mode** → renders all 30+ topics as interactive chips; clicking one calls `GET /topic/:id`

**Design highlights:**
- 🎨 **Dark glassmorphism** — `rgba` translucent panes with `backdrop-filter: blur()`
- 🎨 IARE brand — Deep Navy `#003087` and Crimson `#B8001C`
- 🔤 **Inter** typeface from Google Fonts
- 💬 Message bubbles with smooth slide-in animations
- 🏷️ Source badge on every bot reply: `AI` or `Local KB`
- 📱 Fully responsive layout

### `public/demo.html` — Widget Showcase

A companion demo page at `/demo.html` that:
- Embeds `widget.js` for live testing
- Shows the one-line embed code snippet
- Features animated headings to demonstrate the widget

<br/>

---

## 📦 Scripts

```bash
# ─────────────────────────────────────────────────────
#  Development — start with hot-reload (recommended)
#  TypeScript is re-compiled automatically on save
# ─────────────────────────────────────────────────────
npm run dev

# ─────────────────────────────────────────────────────
#  Build — compile TypeScript → dist/
#  Creates dist/server.js ready for production
# ─────────────────────────────────────────────────────
npm run build

# ─────────────────────────────────────────────────────
#  Start — run the compiled production build
#  Requires 'npm run build' to be run first
# ─────────────────────────────────────────────────────
npm start
```

**Typical workflow:**

```
Development  →  npm run dev
Testing      →  npm run build && npm start
Production   →  npm start  (after build in CI/CD)
```

<br/>

---

## ☁️ Deployment

### ⭐ Option 1 — Render *(Free, Recommended)*

The easiest way to deploy — no credit card required.

1. Push your code to GitHub (ensure `.env` is in `.gitignore`)
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo
4. Set the following:
   ```
   Build Command:  npm install && npm run build
   Start Command:  npm start
   Environment:    Node
   ```
5. Add environment variables in the Render dashboard:
   | Key | Value |
   |---|---|
   | `GEMINI_API_KEY` | `your_key_here` |
   | `USE_LOCAL_KB` | `false` |
   | `AI_PROVIDER` | `gemini` |
6. Click **Deploy** ✅

Your chatbot will be live at `https://your-service-name.onrender.com`

<br/>

### 🚂 Option 2 — Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway variables set GEMINI_API_KEY=your_key_here
railway variables set USE_LOCAL_KB=false
railway up
```

<br/>

### 🖥️ Option 3 — VPS / Ubuntu Server (PM2 + NGINX)

<details>
<summary><b>Click to expand full VPS setup guide</b></summary>

**1. Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**2. Clone, install & build**
```bash
git clone <your-repo-url>
cd ai-chatbot
npm install && npm run build
```

**3. Create `.env`**
```bash
nano .env   # Paste your keys and save
```

**4. Run with PM2**
```bash
sudo npm install -g pm2
pm2 start dist/server.js --name iare-chatbot
pm2 save && pm2 startup
```

**5. NGINX reverse proxy**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
sudo nginx -t && sudo systemctl reload nginx
```

**6. Free HTTPS with Certbot**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

</details>

<br/>

### ☁️ Option 4 — Azure App Service

```bash
npm run build
az login
az webapp up --runtime NODE:20-lts --sku F1 --name iare-chatbot
az webapp config appsettings set \
  --name iare-chatbot \
  --settings GEMINI_API_KEY=your_key USE_LOCAL_KB=false AI_PROVIDER=gemini
```

<br/>

---

## 🔒 Security Best Practices

| ✅ Practice | Why It Matters |
|---|---|
| **Never commit `.env`** | Your API key grants billing access. Leaking it can cause unexpected charges. |
| **Verify `.gitignore`** | Confirm `.env` is listed before every `git push` |
| **Rotate exposed keys** | If accidentally pushed, regenerate immediately at [aistudio.google.com](https://aistudio.google.com/) |
| **Domain-restrict your key** | In Google AI Studio, limit API key to your deployed domain |
| **Use HTTPS in production** | Render / Railway provide TLS automatically. On VPS use Certbot. |
| **Add rate-limiting middleware** | Prevent bot abuse in production with `express-rate-limit` |

**Adding rate limiting (example):**

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per IP per window
  message: { error: 'Too many requests. Please try again later.' }
});

app.use('/chat', limiter);
```

<br/>

---

## 🧩 Extending the Knowledge Base

Add new IARE topics without touching any AI or server logic.

### Step 1 — Add a `KBEntry` to `iareKnowledge.ts`

```typescript
// src/data/iareKnowledge.ts → add inside the iareKnowledge array

{
  topic: "Health Center",
  phrases: [
    "health center",
    "medical facility at iare",
    "campus doctor",
    "first aid at iare"
  ],
  keywords: [
    "health", "medical", "doctor", "nurse",
    "clinic", "sick", "hospital", "ambulance", "medicine"
  ],
  answer: `🏥 **Health Center at IARE**

IARE maintains an on-campus health center available for all students and staff.

• 👨‍⚕️ Doctor available during college hours
• 🩹 First aid & emergency care
• 🏨 Tie-ups with nearby hospitals for serious cases

📞 +91 9154379624 (8 AM – 8 PM)
📧 info@iare.ac.in`
}
```

### Step 2 — (Optional) Register an Icon

In `public/index.html`, find the `ICON_MAP` object and add:

```javascript
const ICON_MAP = {
  // ... existing entries ...
  "Health Center": "🏥",
};
```

### Tips for Writing Great KB Entries

| Tip | Details |
|---|---|
| 📌 **Phrases = exact queries** | Use 2–4 word expressions users would literally type |
| 🔍 **Keywords = synonyms** | Cover alternate words and related terms generously |
| ✍️ **Format answers in Markdown** | Use `**bold**`, `•` bullets, emojis, and link URLs |
| 📞 **Always include a contact** | Give a phone number or URL as a next step |
| ⚠️ **Never invent specifics** | Don't hardcode fees or cut-offs — direct users to call instead |

<br/>

---

## 🐛 Troubleshooting

<details>
<summary><b>🔴 Server won't start / TypeScript errors</b></summary>

```bash
npm install         # Reinstall all dependencies
npm run build       # Check for compile errors
```
</details>

<details>
<summary><b>🔴 Bot replies "AI temporarily unavailable"</b></summary>

You've hit Gemini's free tier limits (30 RPM / 1,500 req/day).
- Wait a few minutes and try again
- Or switch to local mode:
  ```env
  USE_LOCAL_KB=true
  ```
  Then restart the server.
</details>

<details>
<summary><b>🔴 Frontend not loading / "can't connect"</b></summary>

- Make sure the server is running: `npm run dev`
- Open `http://localhost:5000` — not port 3000 or 8080
- Check your firewall isn't blocking port 5000
</details>

<details>
<summary><b>🔴 Widget not showing on my external site</b></summary>

- The server must be **publicly accessible** — `localhost` won't work for external sites
- Point `<script src>` to your deployed URL, e.g.:
  ```html
  <script src="https://your-domain.com/widget.js"></script>
  ```
- Check the browser console for CORS errors
</details>

<details>
<summary><b>🔴 `.env` changes have no effect</b></summary>

Variables are loaded once at startup. After any `.env` change:
```bash
# Stop the server (Ctrl + C), then restart:
npm run dev
```
</details>

<br/>

---

## 📞 IARE Contact

<div align="center">

For questions about **IARE** (the institution, not this codebase):

| | |
|:---:|:---|
| 🌐 | [https://www.iare.ac.in/](https://www.iare.ac.in/) |
| 📞 | **+91 9154379624** *(Admissions, 8 AM – 8 PM)* |
| 📧 | info@iare.ac.in |
| 💼 | pat@iare.ac.in · 9491602701 *(Placements)* |
| 📅 | [Book an Appointment](https://iare.ac.in/appointmentform.html) |
| 📍 | Dundigal – 500 043, Hyderabad, Telangana, India |

<br/>

---

<sub>Built with ❤️ for IARE students, parents, and faculty · Powered by Google Gemini AI</sub>

</div>#   c h a t _ b o t  
 