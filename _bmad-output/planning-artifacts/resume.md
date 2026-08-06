# Portfolio — Prajwal M

---

## 1. Hero

**Name:** Prajwal M

**Headline:**
Harness Engineer — LLM Infrastructure, RAG Pipelines & AI Orchestration

**Tagline:**
I build the harness around LLMs — RAG pipelines, retrieval systems, agent orchestration, and guardrails — on production-grade backend foundations.

**Primary CTA Buttons:**
- "View My Work"
- "Let's Talk"

---

## 2. About

I'm a harness engineer: I build the infrastructure *around* LLMs that makes them reliable, safe, and shippable — retrieval pipelines, agent orchestration, guardrails, and evaluation. My shipped work shows it: an open-source agent harness SDK, a RAG research assistant, and AI chat platforms built with real architecture thinking.

At my day job, I've stabilized a years-old legacy codebase and moved a production database with zero downtime — the production-grade backend discipline underneath the AI work.

I'm now taking on freelance AI and backend projects — if you need an AI feature that actually ships, or an LLM harness built right, let's talk.

**Quick Facts:**
- 🎓 B.E. Computer Science, 7.8 CGPA (2020–2024)
- 💼 1+ year production backend experience
- 📍 Bangalore, India (remote work available)
- ⚡ Specialties: LLM harnesses, RAG, TypeScript/Node.js, AWS

---

## 3. Featured: Shikigami Agent SDK

**An open-source TypeScript agent harness — lean, swappable, no framework lock-in.**

Ship a working AI agent in 30 minutes with full type safety, memory management, reasoning strategies, guardrails, and sub-agent delegation. No framework overhead. No boilerplate. Just a library you call — the harness around the model, not the model itself.

**What it does:**
- **30-minute startup** — from `npm install` to working agent with autocomplete
- **Swap-by-replacement modules** — memory, reasoning, tools, guardrails — change one line, not your architecture
- **Sub-agent delegation** — agents spawn sub-agents recursively, managed by built-in watchdog
- **Pre-flight reasoning** — HyDE and step-back strategies with quality-gating before LLM calls
- **Guardrails first** — deterministic, composable safety gates on user input
- **Streaming observability** — typed events for streaming, metrics, errors
- **Provider agnostic** — works with OpenAI, OpenRouter, Together, Groq, local vLLM

**Stack:** TypeScript · Node.js · OpenAI API · Express/Next.js compatible

**GitHub:** [github.com/shikigami/agent-sdk](https://github.com/shikigami/agent-sdk)  
**Announcement:** [X/Twitter post](https://x.com/Glitch_guy0/status/2083982785803624676?s=20)

---

## 4. Online Presence

| Platform | Link |
|---|---|
| Email | prajwalm9845@gmail.com |
| Phone | +91 98451 20297 |
| GitHub | [github.com/Glitch-guy0](https://github.com/Glitch-guy0) |
| Blog | [glitch-guy0.github.io/blog](https://glitch-guy0.github.io/blog) |
| Location | Bangalore, India |

---

## 5. Skills

**AI & LLM Harnessing**
`LLM Harnessing` `RAG Pipelines` `Agent Orchestration` `Vector Search` `Guardrails` `Prompt Engineering`

**Backend (TypeScript/Node.js)**
`Node.js` `NestJS` `Hono` `Express` `REST APIs` `Server-Sent Events` `WebSockets`

**Databases**
`PostgreSQL` `MongoDB` `DynamoDB` `MySQL` `Redis` `Qdrant`

**Cloud & Infrastructure**
`AWS (EC2, Lambda, DynamoDB)` `Vercel` `Docker` `Docker Compose` `NGINX` `Kafka` `RabbitMQ`

**Auth & Security**
`OAuth2` `OIDC` `JWT` `Okta` `RBAC` `OpenAPI`

**Architecture**
`Distributed Systems` `Hexagonal Architecture` `Microservices` `API Design`

**Mobile**
`React Native` `New Architecture`

---

## 6. Experience

### Backend Engineer — Brigosha, Bangalore
**July 2025 – Present**
*Tech: NestJS · Hono · DynamoDB · React Native · MQTT*

- Led a 2-week end-to-end database migration from MongoDB (~12 collections, ~5,000+ records) to DynamoDB — planned schema restructuring, resolved inherited data inconsistencies, and executed a phased A/B cutover over 3 days with **zero downtime** on 5 critical production collections.
- Inherited and stabilized a NestJS codebase originally built as a 2019 proof-of-concept, unmaintained for 3+ years — audited deprecated packages, resolved compounding bugs, and refactored it into a production-ready backend.
- Implemented a NestJS Guards pipeline with JWT validation, RBAC, and role-based route protection, securing operator and admin access with environment-specific config across dev, staging, and production.
- Built and shipped a React Native operator mobile app (**live on Play Store**) for real-time charger fleet monitoring across iOS and Android using the New Architecture.
- Developed operator-facing Hono backend APIs consuming real-time charger state (active, idle, needs repair) over MQTT, integrated with the operator dashboard.
- Owned feature planning for new operator modules, translating senior leadership requirements directly into production-ready solutions.

---

## 7. Projects

### Shikigami Agent SDK — Open-Source Agent Harness
**Stack:** TypeScript · Node.js · OpenAI API · Express/Next.js compatible
**GitHub:** [github.com/shikigami/agent-sdk](https://github.com/shikigami/agent-sdk)
**Announcement:** [X/Twitter post](https://x.com/Glitch_guy0/status/2083982785803624676?s=20)

A lean, swappable TypeScript agent harness — the scaffold around the model: memory, reasoning strategies, guardrails, tool dispatch, and sub-agent delegation. Builds an agent in 30 minutes with type safety and no framework lock-in. The closest thing to "harness engineering in a box" in the portfolio.

---

### ChaiBookLM — AI Research Assistant
**Stack:** Next.js · TypeScript · RAG · Vector Search · LLM APIs · Qdrant
**GitHub:** [github.com/Glitch-guy0/chaibookLM](https://github.com/Glitch-guy0/chaibookLM)
**Live Demo:** [chaibook-lm.vercel.app](https://chaibook-lm.vercel.app)

An AI-powered research assistant inspired by NotebookLM, supporting:
- Multi-document ingestion with semantic search
- Grounded responses with citations
- AI-generated podcasts, quizzes, and debates
- GitHub repository security analysis

Implemented an end-to-end RAG harness (document parsing → embedding generation → vector search → streaming LLM responses) with modular AI workflows for document processing, retrieval, and orchestration.

---

### ChaiChat — AI Chat Platform
**Stack:** Next.js · TypeScript · Redis · OpenAI · Hexagonal Architecture
**GitHub:** [github.com/Glitch-guy0/ChaiChat](https://github.com/Glitch-guy0/ChaiChat)
**Live Demo:** [chaichat-steel.vercel.app](https://chaichat-steel.vercel.app)

An AI chat platform built with Hexagonal Architecture (domain, application, ports, infrastructure layers) for maintainability and extensibility.
- Low-latency AI conversations using Server-Sent Events (SSE) with streaming OpenAI responses
- Secure session management: JWT authentication, HTTP-only cookies, Redis-backed conversation persistence with automatic TTL
- Reusable AI persona infrastructure supporting multiple system prompts and configurable response modes

---

### chaiGPT — Multi-Provider AI Chat Platform
**Stack:** Next.js · TypeScript · PostgreSQL · Qdrant · Redis · LangChain · Clerk
**GitHub:** [github.com/Glitch-guy0/chaiGPT](https://github.com/Glitch-guy0/chaiGPT)

An AI chat platform supporting multiple LLM providers with:
- Real-time streaming responses and conversation management
- Vector search-powered context retrieval
- Modular architecture for model selection, prompt orchestration, and future tool-calling using LangChain
- Clerk authentication, PostgreSQL for relational data, Qdrant for vector search, Redis for caching/sessions

---

## 8. Services

- **AI feature builds** — RAG pipelines, retrieval systems, and LLM integration: the harness around the model, not just the API call
- **AI chat & agent platforms** — end-to-end products on the pattern of the shipped chat platforms: streaming, auth, sessions, persona infrastructure
- **Backend API design & development** — REST, NestJS, Node.js
- **Database architecture & migrations** — MongoDB, PostgreSQL, DynamoDB, including zero-downtime migration
- **Auth & authorization systems** — JWT, OAuth2, RBAC
- **Legacy codebase audits, stabilization, and modernization**
- **Cloud deployment & infrastructure** — AWS, Docker

### How I Work
1. **Discovery Call** — Understand your goals, constraints, and timeline
2. **Proposal** — Clear scope, milestones, and pricing
3. **Build** — Regular updates, clean code, and documentation
4. **Deliver & Support** — Handover with knowledge transfer and post-launch support

### Availability
Currently accepting freelance/contract AI and backend engineering projects. Open to remote work worldwide.

---

## 9. Contact

**Email:** prajwalm9845@gmail.com
**Phone:** +91 98451 20297
**Location:** Bangalore, India (open to remote work)

**Contact Form Fields:**
- Name
- Email
- Message
