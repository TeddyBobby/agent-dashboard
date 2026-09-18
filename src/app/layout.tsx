import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  // Match the mobile browser chrome (address bar) to the dashboard theme.
  // gray-50 (#f9fafb) and gray-950 (#030712) mirror the page background.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
  // The page renders both schemes (toggled via the `.dark` class on <html>).
  colorScheme: 'light dark',
};

export const metadata: Metadata = {
  title: 'Agent Dashboard — Multi-Agent Monitoring & Analytics',
  description:
    'Real-time dashboard for monitoring AI agents. Track token usage, tool calls, session history, and agent status.',
  keywords: ['AI', 'agent', 'dashboard', 'monitoring', 'analytics', 'Next.js'],
  authors: [{ name: 'TeddyBobby' }],
  openGraph: {
    title: 'Agent Dashboard — Multi-Agent Monitoring',
    description:
      'Real-time dashboard for monitoring AI agents. Track token usage, tool calls, session history, and agent status.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agent Dashboard — Multi-Agent Monitoring',
    description:
      'Real-time dashboard for monitoring AI agents. Track token usage, tool calls, session history, and agent status.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <main>{children}</main>
      </body>
    </html>
  );
}
