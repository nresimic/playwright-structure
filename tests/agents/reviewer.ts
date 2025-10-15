import fs from 'node:fs/promises';
import path from 'node:path';
import { execa } from 'execa';

async function typecheck(file: string) {
  try {
    await execa('npx', ['tsc', '--noEmit', file], { stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

async function runPlaywright(file: string) {
  try {
    await execa('npx', ['playwright', 'test', file, '--reporter=dot'], { stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const targetDir = process.argv[2] || 'generated-tests';
  const files = (await fs.readdir(targetDir)).filter(f => f.endsWith('.ts'));
  if (files.length === 0) {
    console.error('No generated tests found');
    process.exit(1);
  }

  for (const f of files) {
    const full = path.join(targetDir, f);
    const okType = await typecheck(full);
    const okRun = okType ? await runPlaywright(full) : false;
    console.log(JSON.stringify({ file: f, typecheck: okType, run: okRun }));
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
