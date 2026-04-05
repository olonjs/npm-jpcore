# OlonJS MCP (Model Context Protocol) Guide

The `@olonjs/mcp` package acts as a vital bridge between AI assistants (like Cursor's built-in AI or the Cline extension) and your locally running OlonJS Tenant. 

By utilizing Playwright under the hood, it connects a headless browser to your tenant's `/admin` WebMCP interface. This allows the AI to "see" your UI components, inspect JSON schemas, and autonomously perform structural mutations via the JsonPages Admin Protocol (JAP) directly from the chat.

## Prerequisites

- Node.js installed on your system.
- An OlonJS tenant running locally (typically on `http://localhost:5174`).

---

## Quick Start: Automatic Configuration (Recommended)

We provide an automated initialization script that detects your operating system and safely injects the correct MCP configuration into your Cursor and Cline settings.

### Step 1: Run the initialization script
Open your terminal and run the following command. You can run this from anywhere on your system.

```bash
npx @olonjs/mcp init
```

*What this script does:*
1. Detects your environment (macOS, Linux, native Windows, or Windows via WSL).
2. Locates your Cursor `mcp.json` and Cline `cline_mcp_settings.json` files.
3. Automatically sets up the `OlonJS` server configuration pointing to `http://localhost:5174`, generating the specific command structure required for your OS.

### Step 2: Restart your Editor
For Cursor to recognize and boot up the new MCP server, you must reload the window.
- Open the Command Palette (`Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on Mac).
- Type and execute: **`Developer: Reload Window`**.

### Step 3: Start your Tenant
Ensure your OlonJS tenant is actively running so the AI has a target to connect to. In your tenant directory, run:
```bash
npm run dev
```

---

## Manual Configuration (Fallback)

If the automatic setup fails or you prefer to configure the MCP server manually through the UI, open **Cursor Settings -> Features -> MCP**, click **+ Add new MCP Server**, and use the settings below based on your operating system:

**Name:** `OlonJS`
**Type:** `command`

### macOS & Linux
**Command:**
```bash
npx -y @olonjs/mcp@latest http://localhost:5174
```

### Windows (Native installation)
Since Windows requires the explicit batch extension for global executables running in background child processes:
**Command:**
```bash
npx.cmd -y @olonjs/mcp@latest http://localhost:5174
```

### Windows (Developing inside WSL)
If your Cursor UI runs on Windows, but your Node.js environment and code reside inside WSL (e.g., Ubuntu), Cursor needs to bridge the gap:
**Command:**
```bash
wsl -d Ubuntu --cd ~ bash -ilc "npx -y @olonjs/mcp@latest http://localhost:5174"
```
*(Note: Replace `Ubuntu` with your exact WSL distribution name if different).*

---

## Advanced: Authentication Injection

If your tenant's `/admin` route is protected by an authentication wall (e.g., a login screen), the AI's headless browser won't be able to access the underlying WebMCP endpoints to read schemas or apply mutations.

To bypass this exclusively for local AI development, `@olonjs/mcp` supports Auth Injection via environment variables.

When your MCP server starts, if it detects the `OLONJS_PRIVATE_KEY` environment variable, the Playwright bridge will intercept requests to the admin interface and inject this key as an authentication token, granting the AI seamless access.

---

## Troubleshooting

**Error: "Connection refused" or "Target URL unreachable"**
Ensure your tenant is actually running (`npm run dev`) and that it is running on the port specified in your MCP configuration (the default is `5174`). If Vite assigned a different port (like `5173` or `5175`), you must update the URL at the end of the command in your MCP configuration.

**The AI doesn't see recent changes made to the core/schema**
`npx` might aggressively cache the package execution. If the MCP behaves strangely or misses recent updates, run `Developer: Reload Window` in Cursor to kill the background Node process and force `npx` to fetch the fresh `@latest` version again.
