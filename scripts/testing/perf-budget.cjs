const chromeLauncher = require('chrome-launcher');

const URL_TO_AUDIT = 'http://localhost:3000';
const SCORE_THRESHOLD = 90;

const METRICS = [
  ['first-contentful-paint', 'First Contentful Paint'],
  ['largest-contentful-paint', 'Largest Contentful Paint'],
  ['total-blocking-time', 'Total Blocking Time'],
  ['cumulative-layout-shift', 'Cumulative Layout Shift'],
  ['speed-index', 'Speed Index'],
];

async function loadLighthouse() {
  // lighthouse is published as an ESM-only package (no CJS entry point), so a
  // CommonJS script has to reach it via a dynamic import().
  const mod = await import('lighthouse');
  return mod.default || mod;
}

async function run() {
  let chrome;
  try {
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
  } catch (e) {
    console.error('Chrome not found — chrome-launcher could not locate or launch a Chrome installation.');
    console.error(e.message);
    process.exit(1);
    return;
  }

  try {
    const lighthouse = await loadLighthouse();

    let runnerResult;
    try {
      runnerResult = await lighthouse(URL_TO_AUDIT, {
        port: chrome.port,
        output: 'json',
        onlyCategories: ['performance'],
        formFactor: 'mobile',
        throttlingMethod: 'simulate',
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 2.625,
          disabled: false,
        },
      });
    } catch (e) {
      console.error(`Lighthouse run against ${URL_TO_AUDIT} failed — is the production server running (npm run start)?`);
      console.error(e.message);
      process.exit(1);
      return;
    }

    const { lhr } = runnerResult;
    const score = Math.round(lhr.categories.performance.score * 100);

    console.log(`Performance score: ${score}/100`);
    for (const [auditId, label] of METRICS) {
      const audit = lhr.audits[auditId];
      console.log(`${label}: ${audit ? audit.displayValue : 'N/A'}`);
    }

    if (score < SCORE_THRESHOLD) {
      console.error(`\nFAIL: performance score ${score} is below the required threshold of ${SCORE_THRESHOLD}.`);
      process.exit(1);
      return;
    }

    console.log(`\nPASS: performance score ${score} meets the required threshold of ${SCORE_THRESHOLD}.`);
    process.exit(0);
  } finally {
    await chrome.kill();
  }
}

run().catch((e) => {
  console.error('ERR', e.message);
  process.exit(1);
});
