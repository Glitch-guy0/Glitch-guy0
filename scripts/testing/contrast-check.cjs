const fs = require('fs');
const path = require('path');

const CSS_PATH = path.join(__dirname, '../../src/styles/globals.css');

const TOKENS = [
  'color-surface-base',
  'color-surface-raised',
  'color-ink-primary',
  'color-ink-secondary',
  'color-ink-muted',
];

// --color-ink-disabled is intentionally excluded: it only appears on `disabled:`
// form/button states, which WCAG 2.1 AA does not require to meet 4.5:1.
const PAIRS = [
  ['ink-primary', 'surface-base'],
  ['ink-primary', 'surface-raised'],
  ['ink-secondary', 'surface-base'],
  ['ink-secondary', 'surface-raised'],
  ['ink-muted', 'surface-base'],
  ['ink-muted', 'surface-raised'],
];

function extractTokens(block, label) {
  const result = {};
  for (const token of TOKENS) {
    const re = new RegExp(`--${token}:\\s*(#[0-9a-fA-F]{6})`);
    const match = block.match(re);
    if (!match) {
      console.error(`Missing required token --${token} in ${label} block`);
      process.exit(1);
    }
    result[token.replace('color-', '')] = match[1];
  }
  return result;
}

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hexA, hexB) {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

function main() {
  let css;
  try {
    css = fs.readFileSync(CSS_PATH, 'utf8');
  } catch (e) {
    console.error(`Could not read ${CSS_PATH}: ${e.message}`);
    process.exit(1);
    return;
  }

  const themeMatch = css.match(/@theme\s*{([\s\S]*?)\n}/);
  if (!themeMatch) {
    console.error('Could not locate @theme block in globals.css');
    process.exit(1);
  }
  const darkTokens = extractTokens(themeMatch[1], '@theme (dark/default)');

  const lightMediaMatch = css.match(/@media \(prefers-color-scheme: light\)\s*{([\s\S]*)/);
  if (!lightMediaMatch) {
    console.error('Could not locate @media (prefers-color-scheme: light) block in globals.css');
    process.exit(1);
  }
  // Scope to just this media query's content, up to its matching closing brace.
  let depth = 0;
  let end = -1;
  for (let i = 0; i < lightMediaMatch[1].length; i++) {
    const ch = lightMediaMatch[1][i];
    if (ch === '{') depth++;
    if (ch === '}') {
      if (depth === 0) {
        end = i;
        break;
      }
      depth--;
    }
  }
  const lightBlock = end >= 0 ? lightMediaMatch[1].slice(0, end) : lightMediaMatch[1];
  const lightTokens = extractTokens(lightBlock, '@media (prefers-color-scheme: light)');

  const modes = [
    { name: 'dark', tokens: darkTokens },
    { name: 'light', tokens: lightTokens },
  ];

  let passed = 0;
  let failed = 0;

  for (const mode of modes) {
    for (const [inkName, surfaceName] of PAIRS) {
      const ratio = contrastRatio(mode.tokens[inkName], mode.tokens[surfaceName]);
      const ok = ratio >= 4.5;
      if (ok) {
        passed++;
      } else {
        failed++;
      }
      const label = `${ok ? 'PASS' : 'FAIL'} [${mode.name}] ${inkName}/${surfaceName} ${ratio.toFixed(2)}:1`;
      console.log(label);
    }
  }

  console.log(`${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
