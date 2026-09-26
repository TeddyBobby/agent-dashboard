'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { formatTokens, formatUptime, timeAgo, heatCellStyle } from '@/lib/format';

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

// Columns that can be sorted on the session table. All four map to numeric
// fields on SessionInfo, so a single numeric comparator handles them all.
type SortKey = 'messageCount' | 'toolCallCount' | 'tokenCount' | 'lastActive';
type SortDirection = 'asc' | 'desc';

function SortHeader({
  label,
  column,
  activeColumn,
  direction,
  onSort,
}: {
  label: string;
  column: SortKey;
  activeColumn: SortKey;
  direction: SortDirection;
  onSort: (column: SortKey) => void;
}) {
  const isActive = activeColumn === column;
  return (
    <th
      scope="col"
      aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      className="px-4 py-3 text-xs font-medium text-gray-500 uppercase"
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`inline-flex items-center gap-1 rounded transition-colors hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:text-gray-100 ${
          isActive ? 'text-gray-900 dark:text-gray-100' : ''
        }`}
      >
        {label}
        <svg
          aria-hidden="true"
          className={`h-3 w-3 transition-transform ${
            isActive && direction === 'asc' ? 'rotate-180' : ''
          } ${
            isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </th>
  );
}

export default function Home() {
  const [agents] = useState<AgentInfo[]>(() => generateDemoAgents());
  const [sessions] = useState<SessionInfo[]>(() => generateDemoSessions());
  const [tokenUsage] = useState<TokenUsage[]>(() => generateDemoTokenUsage());
  const [toolUsage] = useState<ToolUsage[]>(() => generateDemoToolUsage());
  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [sortColumn, setSortColumn] = useState<SortKey>('lastActive');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const { theme, toggle: toggleTheme } = useTheme();

  // Refresh time-ago labels every 30 seconds so they don't freeze
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const toggleSort = (column: SortKey) => {
    if (column === sortColumn) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const filteredSessions = useMemo(
    () =>
      sessions
        .filter((s) => !search || s.title.toLowerCase().includes(search.toLowerCase()))
        .filter((s) => !selectedAgent || s.agentId === selectedAgent),
    [sessions, search, selectedAgent]
  );

  const sortedSessions = useMemo(() => {
    const factor = sortDirection === 'asc' ? 1 : -1;
    return [...filteredSessions].sort((a, b) => (a[sortColumn] - b[sortColumn]) * factor);
  }, [filteredSessions, sortColumn, sortDirection]);

  const maxTokenVal = Math.max(...tokenUsage.map((t) => t.input + t.output), 1);

  // Tool usage heatmap. `generateDemoToolUsage` already emits a per-day count
  // for each tool, but the previous view flattened those into a single total
  // and discarded the weekday dimension. A heatmap surfaces that dimension so
  // you can see *when* each tool is used most, not just how much overall.
  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const toolTotals = toolUsage.reduce((acc, t) => {
    acc[t.tool] = (acc[t.tool] || 0) + t.count;
    return acc;
  }, {} as Record<string, number>);
  const sortedTools = Object.keys(toolTotals).sort((a, b) => toolTotals[b] - toolTotals[a]);
  const heatmap = sortedTools.map((tool) =>
    WEEKDAYS.map((day) => toolUsage.find((t) => t.tool === tool && t.day === day)?.count ?? 0)
  );
  const rowTotals = heatmap.map((row) => row.reduce((a, b) => a + b, 0));
  const maxHeat = Math.max(...heatmap.flat(), 1);

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
              aria-hidden="true"
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
            {/* Screen-reader accessible data table for the heatmap below */}
            <table className="sr-only">
              <caption>工具调用次数热力图，按工具与星期分布</caption>
              <thead>
                <tr>
                  <th scope="col">工具</th>
                  {WEEKDAYS.map((day) => (
                    <th key={day} scope="col">{day}</th>
                  ))}
                  <th scope="col">合计</th>
                </tr>
              </thead>
              <tbody>
                {sortedTools.map((tool, ti) => (
                  <tr key={tool}>
                    <th scope="row">{tool}</th>
                    {heatmap[ti].map((count, di) => (
                      <td key={WEEKDAYS[di]}>{count}</td>
                    ))}
                    <td>{rowTotals[ti]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div aria-hidden="true" className="overflow-x-auto">
              <table className="w-full border-separate" style={{ borderSpacing: '4px' }}>
                <thead>
                  <tr>
                    <th className="w-24" aria-hidden="true" />
                    {WEEKDAYS.map((day) => (
                      <th key={day} scope="col" className="text-center text-xs font-medium text-gray-500 uppercase">
                        {day}
                      </th>
                    ))}
                    <th scope="col" className="text-center text-xs font-medium text-gray-500 uppercase">
                      合计
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTools.map((tool, ti) => (
                    <tr key={tool}>
                      <th
                        scope="row"
                        className="text-left text-xs font-mono font-normal text-gray-600 dark:text-gray-300 max-w-24 truncate"
                        title={tool}
                      >
                        {tool}
                      </th>
                      {heatmap[ti].map((count, di) => {
                        const style = heatCellStyle(count, maxHeat);
                        return (
                          <td key={WEEKDAYS[di]} className="text-center">
                            <div
                              className="h-9 rounded-md flex items-center justify-center text-xs font-mono"
                              style={{ backgroundColor: style.backgroundColor, color: style.color }}
                              title={`${tool} · ${WEEKDAYS[di]}: ${count}`}
                            >
                              {count}
                            </div>
                          </td>
                        );
                      })}
                      <td className="text-center text-xs font-semibold text-gray-700 dark:text-gray-200">
                        {rowTotals[ti]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-200 inline-block" /> 少
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block" /> 多
              </span>
              <span>颜色越深，调用越频繁</span>
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
                  <th scope="col" className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">会话</th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">智能体</th>
                  <SortHeader label="消息" column="messageCount" activeColumn={sortColumn} direction={sortDirection} onSort={toggleSort} />
                  <SortHeader label="工具调用" column="toolCallCount" activeColumn={sortColumn} direction={sortDirection} onSort={toggleSort} />
                  <SortHeader label="Token" column="tokenCount" activeColumn={sortColumn} direction={sortDirection} onSort={toggleSort} />
                  <SortHeader label="最近活跃" column="lastActive" activeColumn={sortColumn} direction={sortDirection} onSort={toggleSort} />
                </tr>
              </thead>
              <tbody>
                {sortedSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      未找到会话
                    </td>
                  </tr>
                ) : (
                  sortedSessions.map((s) => {
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
