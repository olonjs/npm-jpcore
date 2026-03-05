#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import ora from 'ora';
import { fileURLToPath } from 'url';

// 🛡️ Risoluzione path ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('jsonpages')
  .description('JsonPages CLI - Sovereign Projection Engine')
  .version('2.0.2'); // Bump version

/**
 * 🧠 THE UNIVERSAL INTERPRETER
 * Legge lo script bash "DNA" e lo esegue usando le API di Node.js.
 * Rende la CLI compatibile con Windows (PowerShell/CMD) senza bisogno di Bash.
 */
async function processScriptInNode(scriptPath, targetDir) {
  const content = await fs.readFile(scriptPath, 'utf-8');
  const lines = content.split('\n');
  
  let captureMode = false;
  let delimiter = '';
  let currentFile = '';
  let fileBuffer = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // 1. Modalità Cattura (Siamo dentro un cat << 'DELIMITER')
    if (captureMode) {
      if (trimmed === delimiter) {
        // Fine del blocco: Scriviamo su disco
        const filePath = path.join(targetDir, currentFile);
        await fs.outputFile(filePath, fileBuffer.join('\n'));
        captureMode = false;
        fileBuffer = [];
      } else {
        fileBuffer.push(line); // Preserva l'indentazione originale
      }
      continue;
    }

    // 2. Parsing Comandi Bash -> Node Operations
    
    // Rileva: mkdir -p "path"
    if (trimmed.startsWith('mkdir -p')) {
      const match = trimmed.match(/"([^"]+)"/) || trimmed.match(/\s+([^\s]+)/); 
      // Supporta sia mkdir -p "foo/bar" che mkdir -p foo/bar
      const dirPath = match ? match[1].replace(/"/g, '') : null;
      if (dirPath) {
        await fs.ensureDir(path.join(targetDir, dirPath));
      }
    }
    
    // Rileva: cat << 'DELIMITER' > "path"
    else if (trimmed.startsWith('cat <<')) {
      // Regex robusta per catturare il delimitatore e il path del file
      const match = trimmed.match(/<<\s*'([^']+)'\s*>\s*"([^"]+)"/);
      if (match) {
        delimiter = match[1];
        currentFile = match[2];
        captureMode = true;
      }
    }
    // Ignora echo, set -e, commenti #, ecc.
  }
}

program
  .command('new')
  .argument('<type>', 'Type of artifact (tenant)')
  .argument('<name>', 'Name of the new tenant')
  .option('--script <path>', 'Override default deterministic script path')
  .action(async (type, name, options) => {
    if (type !== 'tenant') {
      console.log(chalk.red('❌ Error: Only "tenant" type is supported.'));
      return;
    }

    const targetDir = path.join(process.cwd(), name);
    
    // 🔍 Asset Resolution
    // Cerca lo script nella cartella assets installata col pacchetto
    const defaultScriptPath = path.resolve(__dirname, '../assets/src_tenant_alpha.sh');
    const scriptPath = options.script ? path.resolve(process.cwd(), options.script) : defaultScriptPath;

    if (!fs.existsSync(scriptPath)) {
      console.log(chalk.red(`❌ Error: DNA script not found at ${scriptPath}`));
      console.log(chalk.yellow(`Debug info: __dirname is ${__dirname}`));
      return;
    }

    console.log(chalk.blue.bold(`\n🚀 Projecting Sovereign Tenant: ${name}\n`));
    const spinner = ora();

    try {
      // 1. SCAFFOLDING INFRA
      spinner.start('Setting up environment (Vite + TS)...');
      await fs.ensureDir(targetDir);
      
      // Windows fix: npm.cmd invece di npm
      const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      
      await execa(npmCmd, ['create', 'vite@latest', '.', '--', '--template', 'react-ts'], { cwd: targetDir });
      spinner.succeed('Environment scaffolded.');

      // 2. CLEANUP
      spinner.start('Wiping default boilerplate...');
      await fs.emptyDir(path.join(targetDir, 'src'));
      const junk = ['App.css', 'App.tsx', 'main.tsx', 'vite-env.d.ts', 'favicon.ico', 'index.html'];
      for (const file of junk) {
        await fs.remove(path.join(targetDir, file)).catch(() => {});
        await fs.remove(path.join(targetDir, 'src', file)).catch(() => {});
      }
      spinner.succeed('Clean slate achieved.');

      // 3. INJECTION
      spinner.start('Injecting Sovereign Configurations...');
      await injectInfraFiles(targetDir, name);
      spinner.succeed('Infrastructure configured.');

      // 4. DETERMINISTIC PROJECTION (Node-based Interpreter)
      spinner.start('Executing deterministic src projection...');
      // Invece di execa('./script.sh'), usiamo il nostro interprete
      await processScriptInNode(scriptPath, targetDir);
      spinner.succeed('Source code and assets projected successfully.');

      // 5. Dependencies: gestite nello script .sh (es. copia/package.json da tenant-alpha o npm install)
      spinner.succeed(chalk.green.bold('✨ Tenant Ready!'));

      console.log(`\n${chalk.white.bgBlue(' NEXT STEPS ')}`);
      console.log(`  ${chalk.cyan(`cd ${name}`)}`);
      console.log(`  ${chalk.cyan(`npm run dev`)}   <- Start development`);
      console.log(`  ${chalk.cyan(`npm run build`)} <- Validate Green Build`);
      console.log(`\nGovernance enforced. Build is now safe.\n`);

    } catch (error) {
      spinner.fail(chalk.red('Projection failed.'));
      console.error(error);
    }
  });

/** Returns full vite.config.ts content with /api/save-to-file, /api/upload-asset, /api/list-assets. Inlined so generated tenant always has save-to-disk. */
function getViteConfigWithSaveToFile() {
  return `/**
 * Generated by @jsonpages/cli. Dev server API: /api/save-to-file, /api/upload-asset, /api/list-assets.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ASSETS_IMAGES_DIR = path.resolve(__dirname, 'public', 'assets', 'images');
const DATA_CONFIG_DIR = path.resolve(__dirname, 'src', 'data', 'config');
const DATA_PAGES_DIR = path.resolve(__dirname, 'src', 'data', 'pages');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);
const IMAGE_MIMES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function safeFilename(original, mimeType) {
  const base = (original.replace(/\\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 128)) || 'image';
  const ext = original.includes('.') ? path.extname(original).toLowerCase() : (mimeType?.startsWith('image/') ? \`.\${(mimeType.split('/')[1] || 'png').replace('jpeg', 'jpg')}\` : '.png');
  return \`\${Date.now()}-\${base}\${IMAGE_EXT.has(ext) ? ext : '.png'}\`;
}

function listImagesInDir(dir, urlPrefix) {
  const list = [];
  if (!fs.existsSync(dir)) return list;
  for (const name of fs.readdirSync(dir)) {
    if (IMAGE_EXT.has(path.extname(name).toLowerCase())) list.push({ id: name, url: \`\${urlPrefix}/\${name}\`, alt: name, tags: [] });
  }
  return list;
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'upload-asset-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'GET' && req.url === '/api/list-assets') {
            try { sendJson(res, 200, listImagesInDir(ASSETS_IMAGES_DIR, '/assets/images')); } catch (e) { sendJson(res, 500, { error: e?.message || 'List failed' }); }
            return;
          }
          const pathname = (req.url || '').split('?')[0];
          if (req.method === 'POST' && pathname === '/api/save-to-file') {
            const chunks = [];
            req.on('data', (chunk) => chunks.push(chunk));
            req.on('end', () => {
              try {
                const raw = Buffer.concat(chunks).toString('utf8');
                if (!raw.trim()) { sendJson(res, 400, { error: 'Empty body' }); return; }
                const body = JSON.parse(raw);
                const { projectState, slug } = body;
                if (!projectState || typeof slug !== 'string') { sendJson(res, 400, { error: 'Missing projectState or slug' }); return; }
                if (!fs.existsSync(DATA_CONFIG_DIR)) fs.mkdirSync(DATA_CONFIG_DIR, { recursive: true });
                if (!fs.existsSync(DATA_PAGES_DIR)) fs.mkdirSync(DATA_PAGES_DIR, { recursive: true });
                if (projectState.site != null) fs.writeFileSync(path.join(DATA_CONFIG_DIR, 'site.json'), JSON.stringify(projectState.site, null, 2), 'utf8');
                if (projectState.theme != null) fs.writeFileSync(path.join(DATA_CONFIG_DIR, 'theme.json'), JSON.stringify(projectState.theme, null, 2), 'utf8');
                if (projectState.menu != null) fs.writeFileSync(path.join(DATA_CONFIG_DIR, 'menu.json'), JSON.stringify(projectState.menu, null, 2), 'utf8');
                if (projectState.page != null) {
                  const safeSlug = (slug.replace(/[^a-zA-Z0-9-_]/g, '_') || 'page');
                  fs.writeFileSync(path.join(DATA_PAGES_DIR, \`\${safeSlug}.json\`), JSON.stringify(projectState.page, null, 2), 'utf8');
                }
                sendJson(res, 200, { ok: true });
              } catch (e) { sendJson(res, 500, { error: e?.message || 'Save to file failed' }); }
            });
            req.on('error', () => sendJson(res, 500, { error: 'Request error' }));
            return;
          }
          if (req.method !== 'POST' || req.url !== '/api/upload-asset') return next();
          const chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
              const { filename, mimeType, data } = body;
              if (!filename || typeof data !== 'string') { sendJson(res, 400, { error: 'Missing filename or data' }); return; }
              const buf = Buffer.from(data, 'base64');
              if (buf.length > MAX_FILE_SIZE_BYTES) { sendJson(res, 413, { error: 'File too large. Max 5MB.' }); return; }
              if (mimeType && !IMAGE_MIMES.has(mimeType)) { sendJson(res, 400, { error: 'Invalid file type' }); return; }
              const name = safeFilename(filename, mimeType);
              if (!fs.existsSync(ASSETS_IMAGES_DIR)) fs.mkdirSync(ASSETS_IMAGES_DIR, { recursive: true });
              fs.writeFileSync(path.join(ASSETS_IMAGES_DIR, name), buf);
              sendJson(res, 200, { url: \`/assets/images/\${name}\` });
            } catch (e) { sendJson(res, 500, { error: e?.message || 'Upload failed' }); }
          });
          req.on('error', () => sendJson(res, 500, { error: 'Request error' }));
        });
      },
    },
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
`;
}

async function injectInfraFiles(targetDir, name) {
  const pkg = {
    name: name,
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    }
  };
  await fs.writeJson(path.join(targetDir, 'package.json'), pkg, { spaces: 2 });

  // Vite config with dev server API: /api/save-to-file, /api/upload-asset, /api/list-assets (always inline so it works when CLI is installed from npm)
  const viteConfig = getViteConfigWithSaveToFile();
  await fs.writeFile(path.join(targetDir, 'vite.config.ts'), viteConfig);

  await fs.ensureDir(path.join(targetDir, 'public', 'assets', 'images'));
  await fs.ensureDir(path.join(targetDir, 'src', 'data', 'config'));
  await fs.ensureDir(path.join(targetDir, 'src', 'data', 'pages'));

  const tsConfig = `
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}`;
  await fs.writeFile(path.join(targetDir, 'tsconfig.json'), tsConfig.trim());

  const shadcnConfig = {
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "radix-nova",
    "rsc": false,
    "tsx": true,
    "tailwind": {
      "config": "",
      "css": "src/index.css",
      "baseColor": "zinc",
      "cssVariables": true,
      "prefix": ""
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils",
      "ui": "@/components/ui",
      "lib": "@/lib",
      "hooks": "@/hooks"
    }
  };
  await fs.writeJson(path.join(targetDir, 'components.json'), shadcnConfig, { spaces: 2 });
}

program.parse();