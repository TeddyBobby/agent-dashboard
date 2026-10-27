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
        {/* Keyboard skip link — the first focusable element lets screen-reader and
            keyboard users bypass the header straight to the dashboard content
            (WCAG 2.4.1 Bypass Blocks). Rendered off-canvas and slid into view
            on focus so it stays invisible to pointer users. */}
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-50 -translate-y-20 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
        >
          跳到主内容
        </a>
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>
      </body>
    </html>
  );
}
