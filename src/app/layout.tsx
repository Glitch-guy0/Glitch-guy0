import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
