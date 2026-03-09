# 💎 JsonPages Sovereign Tenant

> **Status:** Production Ready  
> **Stack:** React 19 + Vite + Tailwind v4 + TypeScript  
> **Architecture:** Sovereign Core (v1.2)

This is not just a template. It is a **Local Operating System** for websites.
You have just downloaded a complete architecture with an integrated CMS, rigorous Type-Safety, and file system persistence.

---

## 🚀 Quick Start (30 Seconds)

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the engine:**
    ```bash
    npm run dev
    ```

3.  **The Magic:**
    *   Go to `http://localhost:5173` to view the site.
    *   Go to `http://localhost:5173/admin` (or append `/admin` to the URL).
    *   Edit some text. Click **Save**.
    *   **Check your code editor:** The JSON file in `src/data/pages` actually changed.

---

## 📚 Onboarding & Guides

We have included operational documentation directly in the `/docs` folder. Choose your path:

### 🎨 1. "Client" Path (Design & Data)
If you only need to layout the site, tweak CSS, or change JSON content without touching the CMS logic.
👉 **[Read: docs/01-Onboarding_Client.md](./docs/01-Onboarding_Client_completo_aggiornato.md)**

### 🏛️ 2. "Governance" Path (Architecture)
If you are the Lead Developer and need to create new Components (Capsules), define Zod Schemas, and configure the Editor for the client.
👉 **[Read: docs/02-Onboarding_Governance.md](./docs/02-Onboarding_Governance_completo_aggiornato.md)**

---

## 📂 Project Anatomy (JSP Protocol)

The structure is not accidental. It follows the **JsonPages Site Protocol**. Do not move files randomly.

```text
src/
├── components/       # 🧱 TBP Capsules. Each folder is an isolated component (View + Schema).
├── data/
│   ├── config/       # ⚙️ Globals: site.json (Header/Footer), menu.json, theme.json.
│   └── pages/        # 📄 Locals: One JSON file per page (e.g., home.json).
├── lib/              # 🧠 Wiring: Registry, Schemas, Configuration.
├── types.ts          # 🛡️ TypeScript Definitions (Single Source of Truth).
└── App.tsx           # 🚀 Entry Point & Cloud Bridge.
```

---

## ☁️ Deployment (Vercel & Netlify)

This project is **Static**. The output of `npm run build` is pure HTML/JS/CSS.
You can deploy it anywhere.

### ▲ Vercel (Recommended)
1.  Install Vercel CLI: `npm i -g vercel`
2.  Deploy: `npx vercel`
3.  Follow the instructions (accept defaults).

### ⚡ Netlify
The project already includes the `public/_redirects` file to handle SPA routing.
1.  Connect the repo to Netlify.
2.  Build command: `npm run build`
3.  Publish directory: `dist`

---

## 💾 Persistence: Local vs. Cloud

The system uses a **Hybrid Strategy** defined in `src/App.tsx`.

1.  **Local (Development):**
    The CMS writes directly to your Hard Disk (`fs`). It's fast and free. The data is yours.

2.  **Production (Vercel/Netlify):**
    The File System is read-only. The "Save" button would not work by default.
    To enable online editing, the project supports the **JsonPages Cloud Bridge**.
    
    *Configuration (Environment Variables):*
    *   `VITE_JSONPAGES_CLOUD_URL`: The API endpoint.
    *   `VITE_JSONPAGES_API_KEY`: Your project key.

    *When configured, the CMS commits changes directly to your Git repository.*

---

**Built with JsonPages.**  
*Busy is the new Boring.*
