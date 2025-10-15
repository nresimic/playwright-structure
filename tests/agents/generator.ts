import fs from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';

async function main() {
  const input = process.argv[2] || 'artifacts/locators.json';
  const outDir = process.argv[3] || 'generated-tests';
  const content = await fs.readFile(input, 'utf8');
  const locators = JSON.parse(content);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Missing OPENAI_API_KEY');
    process.exit(1);
  }
  const client = new OpenAI({ apiKey });

  const system = `You generate Playwright @playwright/test TypeScript tests. Keep tests minimal, deterministic, and relying on provided locators. Only output test file content.`;
  const user = JSON.stringify({ baseURL: locators.url, items: locators.items.slice(0, 100) });

  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: `Create a single spec that attempts a login flow using the best available inputs on the page. Repo uses pages/LoginPage.ts patterns. Use test.describe and test. Assume selectors from items. Data must be fake.` },
      { role: 'user', content: user }
    ],
    temperature: 0.2,
  });

  const code = resp.choices[0]?.message?.content || '';
  if (!code) {
    console.error('No code generated');
    process.exit(1);
  }

  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, 'generated-login.spec.ts');
  await fs.writeFile(outPath, code);
  console.log(`Wrote ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
