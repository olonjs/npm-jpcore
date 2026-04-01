#!/usr/bin/env node
import { PlaywrightBridge } from './bridge.js';
import { OlonJsMcpServer } from './server.js';
import * as process from 'node:process';

async function main() {
  const targetUrl = process.argv[2];
  if (!targetUrl) {
    console.error('====================================================');
    console.error('❌ Missing Target URL');
    console.error('Usage: npx @olonjs/mcp <target-url>');
    console.error('Example: npx @olonjs/mcp http://localhost:5173');
    console.error('====================================================');
    process.exit(1);
  }

  // Normalize URL to always point to /admin to access WebMCP
  const adminUrl = targetUrl.endsWith('/admin') ? targetUrl : `${targetUrl.replace(/\/$/, '')}/admin`;

  const privateKey = process.env.OLONJS_PRIVATE_KEY;

  if (privateKey) {
    console.error(`[OlonJs MCP] Starting bridge to ${adminUrl} with Auth Injection enabled.`);
  } else {
    console.error(`[OlonJs MCP] Starting bridge to ${adminUrl} without Auth Injection. Ensure /admin does not have an Auth Wall or WebMCP is unprotected.`);
  }

  try {
    const bridge = new PlaywrightBridge(adminUrl, privateKey);
    const server = new OlonJsMcpServer(bridge);
    
    await server.run();
  } catch (error) {
    console.error('[OlonJs MCP] Fatal error starting server:', error);
    process.exit(1);
  }
}

main();
