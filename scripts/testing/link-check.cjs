const { JSDOM } = require('jsdom');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIMEOUT_MS = 10000;
// Some hosts (e.g. LinkedIn) return 403 to any request without a browser-like
// User-Agent, and continue blocking datacenter/CI IPs even with one. A 403/999
// there means "this checker got blocked," not "the link is dead" — flag it as
// BLOCKED (needs a manual browser check) instead of a hard FAIL so the gate
// doesn't permanently fail on a false positive.
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const BOT_BLOCK_STATUSES = new Set([403, 999]);

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { 'User-Agent': BROWSER_UA, ...(options.headers || {}) },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function checkOffOrigin(url) {
  try {
    let res = await fetchWithTimeout(url, { method: 'HEAD' });
    if (res.status === 405) {
      res = await fetchWithTimeout(url, { method: 'GET' });
    }
    if (BOT_BLOCK_STATUSES.has(res.status)) {
      return { ok: null, reason: `status ${res.status} (likely bot-blocked — verify manually in a browser)` };
    }
    if (res.status >= 400) {
      return { ok: false, reason: `status ${res.status}` };
    }
    return { ok: true, reason: `status ${res.status}` };
  } catch (e) {
    if (e.name === 'AbortError') {
      return { ok: false, reason: 'timeout' };
    }
    return { ok: false, reason: e.message };
  }
}

async function checkResumePdf(url) {
  try {
    const res = await fetchWithTimeout(url, { method: 'GET' });
    const contentType = res.headers.get('content-type') || '';
    if (res.status !== 200) {
      return { ok: false, reason: `status ${res.status}` };
    }
    if (!contentType.includes('application/pdf')) {
      return { ok: false, reason: `content-type "${contentType}" is not application/pdf` };
    }
    return { ok: true, reason: `status ${res.status}, content-type ${contentType}` };
  } catch (e) {
    if (e.name === 'AbortError') {
      return { ok: false, reason: 'timeout' };
    }
    return { ok: false, reason: e.message };
  }
}

function checkMailto(href) {
  const address = href.slice('mailto:'.length).split('?')[0].trim();
  if (!address || !EMAIL_RE.test(address)) {
    return { ok: false, reason: `invalid or empty address "${address}"` };
  }
  return { ok: true, reason: `valid address ${address}` };
}

async function run() {
  let res;
  try {
    res = await fetch('http://localhost:3000');
  } catch {
    console.error('Could not reach http://localhost:3000 — start the production server first: npm run start');
    process.exit(1);
    return;
  }
  if (!res.ok) {
    console.error(`http://localhost:3000 returned status ${res.status} — expected the site's homepage, not an error page.`);
    process.exit(1);
    return;
  }
  const html = await res.text();
  const dom = new JSDOM(html, { url: 'http://localhost:3000', pretendToBeVisual: true });
  const doc = dom.window.document;

  const anchors = [...doc.querySelectorAll('a[href]')];
  let passed = 0;
  let failed = 0;
  let blocked = 0;

  for (const a of anchors) {
    const href = a.getAttribute('href');
    if (!href) continue;

    if (href.startsWith('#')) {
      // in-page anchor: skip, not counted
      continue;
    }

    if (href.startsWith('mailto:')) {
      const result = checkMailto(href);
      if (result.ok) {
        console.log(`PASS ${href} (${result.reason})`);
        passed++;
      } else {
        console.log(`FAIL ${href} (${result.reason})`);
        failed++;
      }
      continue;
    }

    let absoluteUrl;
    try {
      absoluteUrl = new URL(href, 'http://localhost:3000');
    } catch {
      absoluteUrl = null;
    }

    if (absoluteUrl && absoluteUrl.pathname.toLowerCase().endsWith('.pdf')) {
      const result = await checkResumePdf(absoluteUrl);
      if (result.ok) {
        console.log(`PASS ${href} (${result.reason})`);
        passed++;
      } else {
        console.log(`FAIL ${href} (${result.reason})`);
        failed++;
      }
      continue;
    }

    if (href.startsWith('http://') || href.startsWith('https://')) {
      const result = await checkOffOrigin(href);
      if (result.ok === true) {
        console.log(`PASS ${href} (${result.reason})`);
        passed++;
      } else if (result.ok === null) {
        console.log(`BLOCKED ${href} (${result.reason})`);
        blocked++;
      } else {
        console.log(`FAIL ${href} (${result.reason})`);
        failed++;
      }
      continue;
    }

    // Other same-origin relative links (not resume.pdf, not anchor): not in scope per spec
    // (this is a single-page funnel with no other internal routes), but log rather than
    // silently drop so the report reflects everything found on the page.
    console.log(`SKIP ${href} (unrecognized scheme/target, not checked)`);
  }

  if (anchors.length === 0) {
    console.error('No <a href> elements found on the page — the fetched HTML is likely an error page, not the real site.');
    process.exit(1);
    return;
  }

  console.log(`\n${passed} passed, ${failed} failed, ${blocked} blocked (needs manual browser check)`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error('ERR', e.message);
  process.exit(1);
});
