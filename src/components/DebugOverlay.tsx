'use client';

/**
 * DebugOverlay — Client component island for component iteration and debugging.
 * Only active when process.env.NEXT_PUBLIC_DEBUG_COMPONENTS === 'true'.
 * Injects CSS that renders an ::after pseudo-element showing component names
 * on any container with a `data-component` attribute.
 * In production or when the env flag is false/unset, it renders null (zero DOM impact).
 */
export function DebugOverlay() {
  if (process.env.NEXT_PUBLIC_DEBUG_COMPONENTS !== 'true') {
    return null;
  }

  return (
    <style jsx global>{`
      [data-component] {
        position: relative !important;
      }
      [data-component]::after {
        content: ':: ' attr(data-component);
        position: absolute;
        bottom: 4px;
        right: 6px;
        font-family: var(--font-ibm-plex-mono, monospace);
        font-size: 10px;
        font-weight: 600;
        line-height: 1;
        letter-spacing: 0.05em;
        color: #00ffaa;
        background-color: rgba(0, 0, 0, 0.85);
        border: 1px solid rgba(0, 255, 170, 0.4);
        padding: 3px 6px;
        border-radius: 3px;
        pointer-events: none;
        z-index: 99999;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }
    `}</style>
  );
}
