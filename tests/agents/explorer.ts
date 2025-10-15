import { Page, chromium } from 'playwright';
import fs from 'node:fs/promises';

async function collectLocators(url: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const locators = await page.evaluate(() => {
    function uniqueSelector(el: Element): string {
      if ((el as HTMLElement).id) return `#${(el as HTMLElement).id}`;
      const parts: string[] = [];
      let current: Element | null = el;
      while (current && current.nodeType === 1) {
        const tag = current.tagName.toLowerCase();
        const siblings = Array.from(current.parentElement?.children || []).filter(e => e.tagName === current!.tagName);
        const index = siblings.indexOf(current) + 1;
        const part = siblings.length > 1 ? `${tag}:nth-of-type(${index})` : tag;
        parts.unshift(part);
        current = current.parentElement;
      }
      return parts.join(' > ');
    }

    const elements = Array.from(document.querySelectorAll('*')) as HTMLElement[];
    return elements.slice(0, 500).map(el => ({
      text: el.innerText?.slice(0, 120) || '',
      role: el.getAttribute('role') || '',
      name: el.getAttribute('name') || '',
      id: el.id || '',
      classes: el.className || '',
      tag: el.tagName.toLowerCase(),
      dataTestId: el.getAttribute('data-testid') || '',
      selectors: {
        css: uniqueSelector(el),
      }
    }));
  });

  await browser.close();
  return locators;
}

async function main() {
  const url = process.argv[2] || 'http://localhost:8080/login';
  const output = process.argv[3] || 'artifacts/locators.json';
  const data = await collectLocators(url);
  await fs.mkdir('artifacts', { recursive: true });
  await fs.writeFile(output, JSON.stringify({ url, collectedAt: new Date().toISOString(), items: data }, null, 2));
  console.log(`Saved ${data.length} elements to ${output}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
