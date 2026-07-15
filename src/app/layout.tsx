import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agent Dashboard — Multi-Agent Monitoring & Analytics',
  description:
    'Real-time dashboard for monitoring AI agents. Track token usage, tool calls, session history, and agent status.',
  keywords: ['AI', 'agent', 'dashboard', 'monitoring', 'analytics', 'Next.js'],
  authors: [{ name: 'TeddyBobby' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
