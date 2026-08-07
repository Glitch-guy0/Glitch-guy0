const { JSDOM } = require('jsdom');

async function scan() {
  let res;
  try {
    res = await fetch('http://localhost:3000');
  } catch {
    console.error('Could not reach http://localhost:3000 — start the production server first: npm run start');
    process.exit(1);
  }
  const html = await res.text();
  const dom = new JSDOM(html, { pretendToBeVisual: true });
  global.window = dom.window;
  global.document = dom.window.document;
  global.Node = dom.window.Node;
  global.Element = dom.window.Element;
  global.HTMLElement = dom.window.HTMLElement;

  const doc = dom.window.document;

  // axe rules that work in jsdom
  const axe = require('axe-core');
  const results = await axe.run(doc, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  });
  console.log('AXE TOTAL violations:', results.violations.length);
  results.violations.forEach((v) =>
    console.log('-', v.id, `[${v.impact}]`, v.nodes.length, 'nodes:', v.nodes.map((n) => n.target[0]).join(', ')),
  );
  console.log('AXE rules run:', results.passes.length, '| incomplete:', results.incomplete.map((i) => i.id).join(','));

  // Manual structural checks (jsdom cannot run these as axe rules)
  const mainCount = doc.querySelectorAll('main').length;
  const headerCount = doc.querySelectorAll('header').length;
  const footerCount = doc.querySelectorAll('footer').length;
  const sections = [...doc.querySelectorAll('section')];
  const labelledSections = sections.filter(
    (s) => s.id && s.getAttribute('aria-labelledby') && doc.getElementById(s.getAttribute('aria-labelledby')),
  );
  const skipLink = [...doc.querySelectorAll('a')].find((a) => a.textContent.trim() === 'Skip to content');
  const unlabeledButtons = [...doc.querySelectorAll('button')].filter(
    (b) => !b.getAttribute('aria-label') && !b.textContent.trim(),
  );
  const inputs = [...doc.querySelectorAll('input, textarea')];
  const unlabeledInputs = inputs.filter((i) => !i.id || !doc.querySelector(`label[for="${i.id}"]`));
  const focusableWithoutHref = [...doc.querySelectorAll('a')].filter((a) => !a.getAttribute('href'));
  const emptyLinks = [...doc.querySelectorAll('a')].filter((a) => !a.textContent.trim() && !a.getAttribute('aria-label'));
  const duplicateIds = [...new Set([...doc.querySelectorAll('[id]')].map((e) => e.id))]
    .filter((id) => doc.querySelectorAll(`[id="${id}"]`).length > 1);

  console.log('STRUCTURAL:');
  console.log('- main landmarks:', mainCount, '| header:', headerCount, '| footer:', footerCount);
  console.log('- sections:', sections.length, '| labelled via aria-labelledby:', labelledSections.length);
  console.log('- skip link present:', !!skipLink, '| href:', skipLink?.getAttribute('href'));
  console.log('- unlabeled buttons:', unlabeledButtons.length);
  console.log('- inputs w/o label:', unlabeledInputs.length);
  console.log('- anchors without href:', focusableWithoutHref.length);
  console.log('- empty links (no text, no aria-label):', emptyLinks.length);
  console.log('- duplicate IDs:', duplicateIds.length ? duplicateIds.join(', ') : 'none');
}

scan().catch((e) => {
  console.error('ERR', e.message);
  process.exit(1);
});
