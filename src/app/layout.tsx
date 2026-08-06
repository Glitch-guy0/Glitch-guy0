import type { Metadata } from 'next';
import '@/styles/globals.css';

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
    <html lang="en">
      <body className="antialiased selection:bg-ink-primary selection:text-surface-base">
        {children}
      </body>
    </html>
  );
}
