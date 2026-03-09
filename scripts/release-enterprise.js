#!/usr/bin/env node
import { spawnSync } from 'child_process';

const args = process.argv.slice(2);

function run(cmd, cmdArgs) {
  const result = spawnSync(cmd, cmdArgs, { stdio: 'inherit', shell: false });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('npm', ['run', 'check:templates']);
run('npm', ['run', 'dist:dna:all']);
run('node', ['scripts/release.js', ...args]);
