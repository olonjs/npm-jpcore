#!/usr/bin/env node
import { PlaywrightBridge } from './bridge.js';
import { OlonJsMcpServer } from './server.js';
import * as process from 'node:process';
import * as fs from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

async function initMcp() {
  console.log('\n[OlonJs MCP] Initializing Cursor MCP settings...\n');
  
  const isWin = process.platform === 'win32';
  const commandName = isWin ? 'npx.cmd' : 'npx';
  
  const mcpConfig = {
    command: commandName,
    args: ['-y', '@olonjs/mcp@latest', 'http://localhost:5174']
  };

  const homeDir = os.homedir();
  const pathsToCheck = [
    path.join(homeDir, '.cursor', 'mcp.json'),
  ];

  if (isWin) {
    pathsToCheck.push(path.join(homeDir, 'AppData', 'Roaming', 'Cursor', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'));
  } else if (process.platform === 'darwin') {
    pathsToCheck.push(path.join(homeDir, 'Library', 'Application Support', 'Cursor', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'));
  } else {
    pathsToCheck.push(path.join(homeDir, '.config', 'Cursor', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'));
  }

  let updatedCount = 0;

  for (const configPath of pathsToCheck) {
    try {
      let configData: any = { mcpServers: {} };
      
      if (existsSync(configPath)) {
        const content = await fs.readFile(configPath, 'utf-8');
        try {
          configData = JSON.parse(content);
        } catch (e) {
          console.log(`Warning: Could not parse ${configPath}. Creating new object.`);
        }
      } else {
        const dir = path.dirname(configPath);
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
      }

      if (!configData.mcpServers) {
        configData.mcpServers = {};
      }

      configData.mcpServers['OlonJS'] = mcpConfig;

      await fs.writeFile(configPath, JSON.stringify(configData, null, 2));
      console.log(`✓ Updated MCP configuration at: ${configPath}`);
      updatedCount++;
    } catch (err) {
      console.log(`Skipped ${configPath} (not found or accessible)`);
    }
  }

  if (updatedCount === 0) {
    console.log('\nCould not find any Cursor MCP configuration files to update.');
    console.log('You can manually add the following JSON to your MCP settings:');
    console.log(JSON.stringify({ "OlonJS": mcpConfig }, null, 2));
  } else {
    console.log('\nOlonJS MCP configured successfully!');
    console.log('Please restart Cursor (or run "Developer: Reload Window") to apply the changes.');
  }
}

async function main() {
  const targetUrl = process.argv[2];
  
  if (targetUrl === 'init') {
    await initMcp();
    process.exit(0);
  }

  if (!targetUrl) {
    console.error('====================================================');
    console.error('❌ Missing Target URL');
    console.error('Usage: npx @olonjs/mcp <target-url>');
    console.error('Or setup: npx @olonjs/mcp init');
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
