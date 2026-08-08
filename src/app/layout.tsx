import type { Metadata } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import { Header } from '@/components/Header';
import { CONTACT_EMAIL } from '@/lib/config';
import { MotionProvider } from '@/components/MotionProvider';
import { DebugOverlay } from '@/components/DebugOverlay';
import { CookieBanner } from '@/components/CookieBanner';
import { Analytics } from '@/components/Analytics';
import '@/styles/globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Glitch-guy0 | AI Systems & Platform Engineer',
  description: 'Portfolio of Glitch-guy0 — AI Feature Build, Agent Harnesses, Platform MVPs, and Backend Engineering.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased selection:bg-ink-primary selection:text-surface-base">
        <a
          href="#top"
          className="skip-link rounded-md border border-ink-primary bg-surface-base px-4 py-2 font-mono text-mono-label text-ink-primary"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Header email={CONTACT_EMAIL} />
          {children}
        </MotionProvider>
        <DebugOverlay />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
