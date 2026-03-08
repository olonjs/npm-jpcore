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

      // 5. Install dependencies (lo script .sh deve aver già scritto/copiato package.json in targetDir)
      spinner.start('Installing dependencies (this may take a minute)...');
      await execa(npmCmd, ['install'], { cwd: targetDir });
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
