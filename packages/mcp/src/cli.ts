#!/usr/bin/env node
import { PlaywrightBridge } from './bridge.js';
import { OlonJsMcpServer } from './server.js';
import * as process from 'node:process';
import * as fs from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { execSync } from 'node:child_process';

async function initMcp() {
  console.log('\n[OlonJs MCP] Initializing Cursor MCP settings...\n');
  
  let isWin = process.platform === 'win32';
  let isWsl = false;
  let wslHostHome = '';

  // Detect WSL
  if (process.platform === 'linux' && process.env.WSL_DISTRO_NAME) {
    isWsl = true;
    try {
      // Find the Windows user profile path from within WSL
      const winProfile = execSync('cmd.exe /c "echo %USERPROFILE%"').toString().trim();
      // Convert C:\Users\name to /mnt/c/Users/name
      if (winProfile && winProfile.includes(':\\')) {
        const drive = winProfile.charAt(0).toLowerCase();
        const rest = winProfile.slice(2).replace(/\\/g, '/');
        wslHostHome = `/mnt/${drive}${rest}`;
      }
    } catch (e) {
      console.log('Warning: Detected WSL but could not resolve Windows host profile path.');
    }
  }

  const commandName = isWin || isWsl ? 'wsl' : 'npx';
  const mcpConfig: any = {
    command: commandName,
    args: ['-y', '@olonjs/mcp@latest', 'http://localhost:5174']
  };

  // If we are configuring for a Windows host (either natively or from WSL),
  // we must setup the wsl bridge arguments so the host Windows Cursor can reach the Linux npx.
  if (isWsl) {
    const distro = process.env.WSL_DISTRO_NAME || 'Ubuntu';
    mcpConfig.args = [
      '-d', distro,
      '--cd', '~',
      'bash', '-ilc',
      'npx -y @olonjs/mcp@latest http://localhost:5174'
    ];
  } else if (isWin) {
     mcpConfig.command = 'npx.cmd';
  }

  const homeDir = os.homedir();
  const pathsToCheck: string[] = [];

  // 1. Add native path
  pathsToCheck.push(path.join(homeDir, '.cursor', 'mcp.json'));

  // 2. Add WSL host path if applicable
  if (isWsl && wslHostHome) {
    pathsToCheck.push(path.join(wslHostHome, '.cursor', 'mcp.json'));
    pathsToCheck.push(path.join(wslHostHome, 'AppData', 'Roaming', 'Cursor', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'));
  }

  if (isWin) {
    pathsToCheck.push(path.join(homeDir, 'AppData', 'Roaming', 'Cursor', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'));
  } else if (process.platform === 'darwin') {
    pathsToCheck.push(path.join(homeDir, 'Library', 'Application Support', 'Cursor', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'));
  } else if (!isWsl) {
    pathsToCheck.push(path.join(homeDir, '.config', 'Cursor', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'));
  }

  let updatedCount = 0;

  for (const configPath of pathsToCheck) {
    try {
      let configData: any = { mcpServers: {} };
      
      if (existsSync(configPath)) {
        const content = await fs.readFile(configPath, 'utf-8');
        try {
          // Strip trailing commas before parsing just in case
          const sanitizedContent = content.replace(/,\s*([\]}])/g, '$1');
          configData = JSON.parse(sanitizedContent);
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
