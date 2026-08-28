'use client';

import { useState, useEffect } from 'react';
import {
  generateDemoAgents,
  generateDemoSessions,
  generateDemoTokenUsage,
  generateDemoToolUsage,
  AgentInfo,
  SessionInfo,
  TokenUsage,
  ToolUsage,
} from '@/lib/types';
import { useTheme } from '@/lib/theme';

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-green-500',
  busy: 'bg-yellow-500 animate-pulse',
  idle: 'bg-gray-400',
  offline: 'bg-red-500',
};

const STATUS_LABELS: Record<string, string> = {
  online: '在线',
  busy: '忙碌',
  idle: '空闲',
  offline: '离线',
};

function formatTokens(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function formatUptime(s: number): string {
  if (s === 0) return '—';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
}

function timeAgo(ms: number, now: number): string {
  const diff = now - ms;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  return `${Math.floor(hr / 24)} 天前`;
}

export default function Home() {
  const [agents] = useState<AgentInfo[]>(() => generateDemoAgents());
  const [sessions] = useState<SessionInfo[]>(() => generateDemoSessions());
  const [tokenUsage] = useState<TokenUsage[]>(() => generateDemoTokenUsage());
  const [toolUsage] = useState<ToolUsage[]>(() => generateDemoToolUsage());
  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const { theme, toggle: toggleTheme } = useTheme();

  // Refresh time-ago labels every 30 seconds so they don't freeze
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const filteredSessions = sessions
    .filter((s) => !search || s.title.toLowerCase().includes(search.toLowerCase()))
    .filter((s) => !selectedAgent || s.agentId === selectedAgent);

  const maxTokenVal = Math.max(...tokenUsage.map((t) => t.input + t.output), 1);

  // Aggregate tool usage by tool
  const toolTotals = toolUsage.reduce(
    (acc, t) => {
      acc[t.tool] = (acc[t.tool] || 0) + t.count;
      return acc;
    },
    {} as Record<string, number>
  );
  const sortedToolTotals = Object.entries(toolTotals).sort(([, a], [, b]) => b - a);
  const maxToolTotal = Math.max(...Object.values(toolTotals), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">🤖 Agent 监控面板</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              实时监控你的 AI Agent
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {/* Sun icon for dark mode → switch to light */}
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Agent status cards */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            智能体
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                role="button"
                tabIndex={0}
                aria-pressed={selectedAgent === agent.id}
                aria-label={`筛选 ${agent.name} 的会话`}
                onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedAgent(selectedAgent === agent.id ? null : agent.id);
                  }
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedAgent === agent.id
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[agent.status]}`} />
                    <span className="text-xs font-medium text-gray-500">{STATUS_LABELS[agent.status]}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{agent.model}</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{agent.name}</h3>
                {agent.currentTask && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{agent.currentTask}</p>
                )}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <div className="text-xs text-gray-400">会话</div>
                    <div className="text-sm font-semibold">{agent.totalSessions}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Token</div>
                    <div className="text-sm font-semibold">{formatTokens(agent.totalTokens)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">运行</div>
                    <div className="text-sm font-semibold">{formatUptime(agent.uptime)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Token usage bar chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Token 用量（7 天）
            </h3>
            {/* Screen-reader accessible data table for the chart below */}
            <table className="sr-only">
              <caption>过去 7 天 Token 用量，输入与输出</caption>
              <thead>
                <tr>
                  <th scope="col">日期</th>
                  <th scope="col">输入 Token</th>
                  <th scope="col">输出 Token</th>
                </tr>
              </thead>
              <tbody>
                {tokenUsage.map((day) => (
                  <tr key={day.date}>
                    <td>{day.date}</td>
                    <td>{formatTokens(day.input)}</td>
                    <td>{formatTokens(day.output)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              role="img"
              aria-label="过去 7 天 Token 用量柱状图：每个条形左侧蓝色为输入，右侧紫色为输出"
              className="space-y-2"
            >
              {tokenUsage.map((day) => {
                const total = day.input + day.output;
                const pct = (total / maxTokenVal) * 100;
                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-8">{day.date}</span>
                    <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(day.input / total) * pct}%` }}
                      />
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${(day.output / total) * pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-mono w-16 text-right">
                      {formatTokens(total)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-500 rounded inline-block" /> 输入
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-purple-500 rounded inline-block" /> 输出
              </span>
            </div>
          </div>

          {/* Tool usage heatmap */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              工具用量
            </h3>
            {/* Screen-reader accessible data table for the chart below */}
            <table className="sr-only">
              <caption>工具调用次数，按工具聚合</caption>
              <thead>
                <tr>
                  <th scope="col">工具</th>
                  <th scope="col">调用次数</th>
                </tr>
              </thead>
              <tbody>
                {sortedToolTotals.map(([tool, count]) => (
                  <tr key={tool}>
                    <td>{tool}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              role="img"
              aria-label="工具调用次数横向柱状图，按调用次数从高到低排列"
              className="space-y-2"
            >
              {sortedToolTotals.map(([tool, count]) => {
                const pct = (count / maxToolTotal) * 100;
                return (
                  <div key={tool} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-600 dark:text-gray-300 w-24 truncate">
                      {tool}
                    </span>
                    <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-mono w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sessions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              最近会话
            </h2>
            <div role="search" className="flex items-center gap-2">
              <label htmlFor="session-search" className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                搜索会话
              </label>
              <input
                id="session-search"
                type="search"
                autoComplete="off"
                placeholder="按标题搜索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
              />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <caption className="sr-only">最近会话列表</caption>
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">会话</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">智能体</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">消息</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">工具调用</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Token</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">最近活跃</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      未找到会话
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((s) => {
                    const agent = agents.find((a) => a.id === s.agentId);
                    return (
                      <tr
                        key={s.id}
                        className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                          {s.title}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {agent?.name || '未知'}
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-mono">{s.messageCount}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono">{s.toolCallCount}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono">{formatTokens(s.tokenCount)}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{timeAgo(s.lastActive, now)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
