'use client';

import { useState } from 'react';
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

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
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
  const maxToolTotal = Math.max(...Object.values(toolTotals), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <h1 className="text-xl font-bold">🤖 Agent 监控面板</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          实时监控你的 AI Agent
        </p>
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
                onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
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
            <div className="space-y-2">
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
            <div className="space-y-2">
              {Object.entries(toolTotals)
                .sort(([, a], [, b]) => b - a)
                .map(([tool, count]) => {
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
            <input
              type="text"
              placeholder="搜索会话..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
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
                        <td className="px-4 py-3 text-gray-400 text-xs">{timeAgo(s.lastActive)}</td>
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
