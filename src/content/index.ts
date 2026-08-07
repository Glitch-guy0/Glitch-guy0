/**
 * Canonical site content — single source of truth for all copy (AD-4).
 * PRD-approved sets are canonical; resume.md feeds hero headline/tagline
 * and Experience work statements only. No JSX string literals for content.
 */

import type { SiteContent } from './types';

export const siteContent: SiteContent = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    headline: 'I build the harness around LLMs — RAG pipelines, agent orchestration, and production-grade backends.',
    tagline:
      'Retrieval systems, guardrails, and AI infrastructure that actually ships. Freelance AI & backend engineering.',
    ctaLabel: "LET'S TALK",
    secondaryLabel: 'VIEW MY WORK',
  },

  // ── Services — three packaged offers (FR-6, FR-7, FR-8) ──────────────────
  offers: [
    {
      name: 'AI Feature Build',
      scope: 'RAG pipelines, retrieval systems, and LLM integration — the harness around the model, not just the API call.',
      deliverables: [
        'Vector search + embedding pipeline',
        'Retrieval-augmented generation module',
        'LLM integration with guardrails',
        'Streaming observability',
        'Clean TypeScript library or API',
      ],
      timeline: '2–4 weeks',
    },
    {
      name: 'AI Chat & Agent Platform',
      scope: 'End-to-end products on the pattern of the shipped chat platforms — streaming, auth, sessions, persona infrastructure.',
      deliverables: [
        'Multi-provider LLM routing',
        'Streaming conversations (SSE)',
        'Auth, sessions, and persistence',
        'Agent orchestration with sub-agents',
        'Deployed on Vercel or AWS',
      ],
      timeline: '3–6 weeks',
    },
    {
      name: 'Backend API & Infrastructure',
      scope: 'REST APIs, database design, auth, cloud deployment, and legacy codebase stabilization.',
      deliverables: [
        'NestJS / Node.js REST API',
        'Database design & migrations',
        'JWT + RBAC auth pipeline',
        'Docker + Vercel/AWS deployment',
        'Documentation handover',
      ],
      timeline: '2–5 weeks',
    },
  ],

  // ── Featured Projects (FR-9, FR-10, FR-11, FR-12) ────────────────────────
  // Shikigami Agent SDK is first in DOM order (FR-10)
  featuredProjects: [
    {
      title: 'Shikigami Agent SDK',
      tagline: 'Open-source TypeScript agent harness — lean, swappable, no framework lock-in.',
      problem:
        'Building production AI agents requires gluing together memory, reasoning, guardrails, and tool dispatch — there was no lean, type-safe library that handled the harness without framework overhead.',
      solution:
        'A modular TypeScript SDK with swap-by-replacement modules: memory, reasoning strategies (HyDE, step-back), deterministic guardrails, tool dispatch, and sub-agent delegation — all behind a single typed interface.',
      result:
        'Ships a working agent in under 30 minutes from `npm install`. Provider-agnostic across OpenAI, OpenRouter, Groq, and local vLLM. Open-sourced with an announcement that reached 2k+ views.',
      githubUrl: 'https://github.com/Glitch-guy0/shikigami-agent-sdk',
      imageSrc: '/images/shikigami-placeholder.svg',
      imageAlt:
        'Code terminal showing Shikigami Agent SDK initialization: import { Agent } from "shikigami"; const agent = new Agent({ memory, tools, guardrails });',
      stack: 'TypeScript · Node.js · OpenAI API · Express/Next.js compatible',
    },
    {
      title: 'ChaiBookLM',
      tagline: 'AI research assistant — multi-document RAG with grounded citations.',
      problem:
        'Researchers juggling multiple documents had no tool that could ground AI responses in their own uploaded sources and surface citations inline.',
      solution:
        'An end-to-end RAG harness: document parsing → embedding generation → Qdrant vector search → streaming LLM responses with citation blocks. Modular AI workflows for podcast, quiz, and debate generation from the same corpus.',
      result:
        'Live in production on Vercel. Supports multi-document ingestion, semantic search, grounded responses, and AI-generated podcasts — demonstrating a complete retrieval pipeline built from scratch.',
      githubUrl: 'https://github.com/Glitch-guy0/chaibookLM',
      liveUrl: 'https://chaibook-lm.vercel.app',
      imageSrc: '/images/chaibooklm-landing.jpg',
      imageAlt: 'ChaiBookLM landing page showing the document upload interface and AI research assistant chat panel',
      stack: 'Next.js · TypeScript · RAG · Qdrant · LLM APIs',
    },
    {
      title: 'ChaiChat',
      tagline: 'AI chat platform built on Hexagonal Architecture for maintainability at scale.',
      problem:
        'AI chat prototypes collapse into tangled code as features grow; there was no reference showing how to apply proper architectural thinking (domain, ports, infrastructure) to an LLM-powered product.',
      solution:
        'Hexagonal Architecture (domain, application, ports, infrastructure layers) with SSE-based streaming, JWT auth, HTTP-only cookies, and Redis-backed conversation persistence with automatic TTL.',
      result:
        'Live on Vercel. Low-latency streaming conversations, secure session management, and a reusable AI persona infrastructure supporting multiple system prompts — a clean architectural baseline for any chat product.',
      githubUrl: 'https://github.com/Glitch-guy0/ChaiChat',
      liveUrl: 'https://chaichat-steel.vercel.app',
      imageSrc: '/images/persona-chat-landing.jpg',
      imageAlt: 'ChaiChat landing page showing the AI persona selector and streaming conversation interface',
      stack: 'Next.js · TypeScript · Redis · OpenAI · Hexagonal Architecture',
    },
  ],

  // ── Secondary Showcase (FR-14) ─────────────────────────────────────────────
  showcaseProjects: [
    {
      title: 'chaiGPT',
      description:
        'Multi-provider AI chat platform with real-time streaming, vector search-powered context retrieval, Clerk auth, and modular LangChain orchestration.',
      githubUrl: 'https://github.com/Glitch-guy0/chaiGPT',
      stack: 'Next.js · TypeScript · PostgreSQL · Qdrant · Redis · LangChain · Clerk',
    },
  ],

  // ── About (FR-15) ─────────────────────────────────────────────────────────
  about: {
    paragraphs: [
      "I'm a harness engineer: I build the infrastructure around LLMs that makes them reliable, safe, and shippable — retrieval pipelines, agent orchestration, guardrails, and evaluation. My shipped work shows it: an open-source agent harness SDK, a RAG research assistant, and AI chat platforms built with real architecture thinking.",
      "At my day job I've stabilized a years-old legacy codebase and moved a production database with zero downtime — the production-grade backend discipline underneath the AI work.",
      "I'm now taking on freelance AI and backend projects. If you need an AI feature that actually ships, or an LLM harness built right, let's talk.",
    ],
  },

  // ── Skills — 6–8 domain pills, harness-first (FR-16, FR-17) ─────────────
  skillPills: [
    'LLM Harnessing',
    'RAG Pipelines',
    'Agent Orchestration',
    'Backend Engineering',
    'Database Architecture',
    'Cloud & Deployment',
  ],

  // ── Experience — outcome-framed work statements (FR-18) ───────────────────
  workStatements: [
    {
      role: 'Backend Engineer — Brigosha',
      outcome: 'Zero-downtime MongoDB → DynamoDB migration across 5 critical production collections',
      detail:
        'Led a 2-week end-to-end migration (~12 collections, ~5,000+ records). Planned schema restructuring, resolved inherited data inconsistencies, and executed a phased A/B cutover over 3 days with no production interruption.',
    },
    {
      role: 'Backend Engineer — Brigosha',
      outcome: 'Stabilized a 2019 NestJS proof-of-concept into a production-ready backend',
      detail:
        'Inherited a codebase unmaintained for 3+ years. Audited deprecated packages, resolved compounding bugs, and refactored it into a maintainable production backend with JWT + RBAC guards and environment-specific config.',
    },
    {
      role: 'Backend Engineer — Brigosha',
      outcome: 'Shipped a React Native operator app to the Play Store for real-time charger fleet monitoring',
      detail:
        'Built and launched an iOS and Android app using the New Architecture, consuming real-time charger state over MQTT and integrating with operator-facing Hono backend APIs.',
    },
  ],

  // ── Contact (FR-19–FR-22) ──────────────────────────────────────────────
  contact: {
    heading: 'Contact',
    subhead: "Have a project in mind? Tell me what you're building.",
    nameLabel: 'Name',
    emailLabel: 'Email',
    messageLabel: 'Message',
    submitLabel: 'SEND MESSAGE',
    submittingLabel: 'SUBMITTING…',
    successMessage: "Message sent. I'll get back to you shortly.",
    errorMessage: "Something went wrong and your message wasn't sent.",
    retryLabel: 'RETRY',
  },
};
