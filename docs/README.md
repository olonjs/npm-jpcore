# OlonJS — The Contract Layer for the Agentic Web

**OlonJS** is an open-source JavaScript infrastructure designed to bridge the gap between human-centric websites and AI agents. It introduces a **deterministic machine contract** for web content: every page is natively available as a typed JSON endpoint (`/{slug}.json`), making websites reliably readable and operable by AI agents while preserving a high-end human UI.

[![NPM Version](https://img.shields.io/npm/v/@olonjs/core.svg)](https://www.npmjs.com/package/@olonjs/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## 🚀 The Vision

Websites are currently built for humans (HTML-heavy, fragmented). AI agents struggle with scraping and non-deterministic structures. **OlonJS** standardizes the web-to-agent interface through:

-   **WebMCP Readiness:** Native integration with the **Model Context Protocol**. OlonJS sites act as MCP Servers, exposing content as Resources and sections as Tools for AI-orchestrated browsers (Chrome WebMCP).
-   **Predictable Endpoints:** Canonical JSON sidecars for every route. No scraping, just pure data.
-   **Schema-Driven Contracts:** Zod-validated content structures defined by the tenant. The schema is the API.
-   **Sovereign Architecture:** A core JavaScript engine that orchestrates the runtime state and deterministic rendering of polymorphic web content.

## 📦 Monorepo Structure (Nx + Workspaces)

This repository manages the entire OlonJS ecosystem:

- **`packages/core` (@olonjs/core):** The runtime engine. Handles routing, state orchestration, and the Visual Studio (ICE).
- **`packages/cli` (@olonjs/cli):** The primary entry point for developers. Scaffolds new tenants by projecting DNA templates.
- **`packages/stack` (@olonjs/stack):** Version manifest package to keep dependency policy aligned.
- **`apps/tenant-alpha`:** Source of truth for the `alpha` DNA template.
- **`apps/tenant-agritourism`:** Source of truth for the `agritourism` DNA template.

## 🚦 Getting Started

### Scaffolding a new Tenant
The only command you need to start a new project with the OlonJS DNA:
```bash
npx @olonjs/cli new tenant my-agentic-site --template alpha
```
*Supported templates: `alpha` (default), `agritourism`.*

### Local Monorepo Development
```bash
# Install dependencies for all packages and apps
npm install

# Run the reference alpha tenant
npm run dev

# Run the agritourism tenant
npm run dev2
```

## 📖 Documentation Index

Detailed technical documentation is available in the `docs/` directory:

### Core Architecture & CLI
- **[Architecture](./docs/ARCHITECTURE.md):** Monorepo layout, package responsibilities, and DNA regeneration flow.
- **[CLI Contract](./docs/CLI.md):** Command surface, template resolution, and generation pipeline.
- **[Templates Governance](./docs/TEMPLATES.md):** Rules for managing DNA source of truth and conformance checks.

### Onboarding & Governance
- **[Client Onboarding](./docs_governance_en.md):** Guide for graphics and data development.
- **[Governance Path](./docs/docs_governance_en.md):** Full CMS integration (Studio, ICE, Form Factory, IDAC).


### Ops & Maintenance
- **[Publishing & Release](./docs/PUBLISHING.md):** Operational source of truth for NPM releases and DNA sync.
- **[Compatibility Cutoff](./docs/COMPAT_CUTOFF_EN.md):** Decommissioning plan for legacy `jsonpages` residues.

## 🛠️ Technical Stack
- **Runtime:** React 19, TypeScript, Zod.
- **Build:** Vite 6 + Tailwind CSS v4.
- **Protocol:** WebMCP (Model Context Protocol) ready via deterministic JSON endpoints.

## 🌐 JavaScript Ecosystem Integration
OlonJS is a pure JavaScript/TypeScript ecosystem project. It leverages runtime polymorphism and Zod-driven schemas to redefine how content is served and manipulated by AI. By providing a standard library for machine-readable websites, OlonJS contributes to the evolution of the JavaScript ecosystem in the age of AI.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Built for the Agentic Web by the OlonJS Team.**  
[olonjs.io](https://olonjs.io)

---

