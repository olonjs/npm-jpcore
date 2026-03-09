#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const [repoRoot, appRel, templateName, ...targets] = process.argv.slice(2);
if (!repoRoot || !appRel || !templateName || targets.length === 0) {
  console.error('Usage: node scripts/generate-template-dna.mjs <repoRoot> <appRel> <templateName> <targets...>');
  process.exit(1);
}

const appDir = path.join(repoRoot, appRel);
const assetsDir = path.join(repoRoot, 'packages', 'cli', 'assets');
const templateDir = path.join(assetsDir, 'templates', templateName);
const outFile = path.join(templateDir, 'src_tenant.sh');

fs.mkdirSync(templateDir, { recursive: true });

const lines = ['#!/bin/bash', 'set -e', '', 'echo "Starting project reconstruction..."', ''];

function toPosix(relPath) {
  return relPath.split(path.sep).join('/');
}

function isTextFile(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    for (const b of buf) {
      if (b === 0) return false;
    }
    return true;
  } catch {
    return false;
  }
}

for (const target of targets) {
  const targetPath = path.join(appDir, target);
  if (!fs.existsSync(targetPath)) continue;

  const stack = [targetPath];
  const all = [];
  while (stack.length) {
    const current = stack.pop();
    all.push(current);
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      const children = fs.readdirSync(current).map((n) => path.join(current, n));
      for (const child of children) {
        const rel = path.relative(appDir, child);
        if (rel.split(path.sep).some((p) => p.startsWith('.'))) continue;
        stack.push(child);
      }
    }
  }

  all.sort((a, b) => a.localeCompare(b));

  for (const item of all) {
    const rel = toPosix(path.relative(appDir, item));
    const stat = fs.statSync(item);

    if (stat.isDirectory()) {
      lines.push(`mkdir -p "${rel}"`);
      continue;
    }

    if (!isTextFile(item)) {
      lines.push(`# SKIP: ${rel} is binary and cannot be embedded as text.`);
      continue;
    }

    lines.push(`echo "Creating ${rel}..."`);
    lines.push(`cat << 'END_OF_FILE_CONTENT' > "${rel}"`);
    const content = fs.readFileSync(item, 'utf8');
    lines.push(...content.split(/\r?\n/));
    lines.push('END_OF_FILE_CONTENT');

    if (item.endsWith('.sh')) {
      lines.push(`chmod +x "${rel}"`);
    }
  }
}

fs.writeFileSync(outFile, `${lines.join('\n')}\n`, 'utf8');
fs.writeFileSync(
  path.join(templateDir, 'manifest.json'),
  JSON.stringify({ name: templateName, sourceApp: path.basename(appDir), dnaScript: 'src_tenant.sh' }, null, 2) + '\n',
  'utf8'
);

if (templateName === 'alpha') {
  fs.copyFileSync(outFile, path.join(assetsDir, 'src_tenant_alpha.sh'));
}

console.log(`[dna] generated: ${outFile}`);
