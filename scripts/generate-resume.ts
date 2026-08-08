/**
 * Resume PDF generation script.
 * Runs at build time to generate /public/resume.pdf from src/content/index.ts (AD-4).
 * Uses pdf-lib for lightweight, build-fast PDF creation. Run with `bun run scripts/generate-resume.ts`.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb } from 'pdf-lib';
import { siteContent } from '@/content/index';
import { CONTACT_EMAIL } from '@/lib/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUTPUT_PATH = path.join(__dirname, '../public/resume.pdf');
const MIN_PDF_SIZE = 1024; // sanity floor to catch empty/corrupt output, not a stylistic size target

const COLORS = {
  black: rgb(0, 0, 0),
  darkGray: rgb(0.25, 0.25, 0.25),
  mediumGray: rgb(0.61, 0.61, 0.61),
};

const FONT_SIZES = {
  title: 24,
  section: 14,
  body: 11,
  small: 9,
};

const MARGINS = { top: 40, bottom: 40, left: 40, right: 40 };
const LINE_HEIGHT = 1.5;
const PAGE_SIZE: [number, number] = [612, 792]; // Letter

// Maps common typographic characters to their WinAnsi-safe equivalents; any
// character still outside Latin-1 after this falls back to sanitizeFallback
// below so unknown future content can never crash the Helvetica encoder.
function sanitize(text: string): string {
  const mapped = text
    .replace(/[→⇒]/g, '->')
    .replace(/[–—]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, '...')
    .replace(/•/g, '*');
  return Array.from(mapped)
    .map((ch) => (ch.codePointAt(0)! > 0xff ? '?' : ch))
    .join('');
}

async function generateResumePDF() {
  console.log('Generating resume PDF...');

  const doc = await PDFDocument.create();
  let page = doc.addPage(PAGE_SIZE);
  let { width, height } = page.getSize();
  const font = await doc.embedFont('Helvetica');
  let yPos = height - MARGINS.top;
  const usableWidth = width - MARGINS.left - MARGINS.right;

  const ensureSpace = (needed: number) => {
    if (yPos - needed < MARGINS.bottom) {
      page = doc.addPage(PAGE_SIZE);
      ({ width, height } = page.getSize());
      yPos = height - MARGINS.top;
    }
  };

  const wrapText = (text: string, fontSize: number, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, fontSize) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  const drawText = (text: string, options: { fontSize?: number; color?: ReturnType<typeof rgb> } = {}) => {
    const { fontSize = FONT_SIZES.body, color = COLORS.black } = options;
    const clean = sanitize(text);
    for (const line of wrapText(clean, fontSize, usableWidth)) {
      ensureSpace(fontSize * LINE_HEIGHT);
      page.drawText(line, { x: MARGINS.left, y: yPos, size: fontSize, color, font });
      yPos -= fontSize * LINE_HEIGHT;
    }
  };

  const drawSectionHeading = (text: string) => {
    yPos -= 8;
    drawText(text, { fontSize: FONT_SIZES.section, color: COLORS.black });
    yPos -= 4;
  };

  // ── Header ────────────────────────────────────────────────────────────
  drawText('RESUME', { fontSize: FONT_SIZES.title, color: COLORS.black });
  yPos -= 4;
  drawText(siteContent.hero.headline, { fontSize: FONT_SIZES.body, color: COLORS.mediumGray });
  drawText(siteContent.hero.tagline, { fontSize: FONT_SIZES.small, color: COLORS.mediumGray });

  // ── Skills ────────────────────────────────────────────────────────────
  drawSectionHeading('SKILLS');
  drawText(siteContent.skillPills.join(' * '), { fontSize: FONT_SIZES.body, color: COLORS.darkGray });

  // ── Experience ────────────────────────────────────────────────────────
  drawSectionHeading('EXPERIENCE');
  for (const stmt of siteContent.workStatements) {
    drawText(stmt.role, { fontSize: FONT_SIZES.body, color: COLORS.black });
    drawText(stmt.outcome, { fontSize: FONT_SIZES.body, color: COLORS.darkGray });
    drawText(stmt.detail, { fontSize: FONT_SIZES.small, color: COLORS.mediumGray });
    yPos -= 6;
  }

  // ── Featured Projects ─────────────────────────────────────────────────
  drawSectionHeading('FEATURED PROJECTS');
  for (const proj of siteContent.featuredProjects) {
    drawText(proj.title, { fontSize: FONT_SIZES.body, color: COLORS.black });
    drawText(proj.tagline, { fontSize: FONT_SIZES.small, color: COLORS.mediumGray });
    drawText(proj.stack, { fontSize: FONT_SIZES.small, color: COLORS.mediumGray });
    yPos -= 6;
  }

  // ── Footer contact line ───────────────────────────────────────────────
  yPos -= 4;
  drawText(`https://github.com/Glitch-guy0  *  ${CONTACT_EMAIL}`, {
    fontSize: FONT_SIZES.small,
    color: COLORS.mediumGray,
  });

  const pdfBytes = await doc.save();
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_PATH, pdfBytes);

  const fileSize = fs.statSync(OUTPUT_PATH).size;
  if (fileSize < MIN_PDF_SIZE) {
    throw new Error(`Generated PDF is too small (${fileSize} bytes, expected > ${MIN_PDF_SIZE} bytes)`);
  }

  console.log(`Resume PDF generated: ${OUTPUT_PATH} (${(fileSize / 1024).toFixed(1)} KB)`);
}

generateResumePDF().catch((error) => {
  console.error('Resume generation failed:', error instanceof Error ? (error.stack ?? error.message) : error);
  process.exit(1);
});
