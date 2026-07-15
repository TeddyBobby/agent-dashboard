// Types for the Agent Dashboard

export interface AgentInfo {
  id: string;
  name: string;
  model: string;
  status: 'online' | 'busy' | 'idle' | 'offline';
  currentTask?: string;
  totalSessions: number;
  totalTokens: number;
  totalToolCalls: number;
  uptime: number; // seconds
}

export interface SessionInfo {
  id: string;
  agentId: string;
  title: string;
  messageCount: number;
  toolCallCount: number;
  tokenCount: number;
  createdAt: number;
  lastActive: number;
}

export interface TokenUsage {
  date: string;
  input: number;
  output: number;
}

export interface ToolUsage {
  tool: string;
  count: number;
  day: string; // 'Mon', 'Tue', etc.
}

// Demo data
export function generateDemoAgents(): AgentInfo[] {
  return [
    {
      id: 'agent-1',
      name: 'Code Helper',
      model: 'claude-sonnet-4',
      status: 'busy',
      currentTask: 'Refactoring auth middleware',
      totalSessions: 247,
      totalTokens: 1850000,
      totalToolCalls: 3204,
      uptime: 259200,
    },
    {
      id: 'agent-2',
      name: 'Research Bot',
      model: 'gemini-2.5-pro',
      status: 'online',
      totalSessions: 89,
      totalTokens: 620000,
      totalToolCalls: 1102,
      uptime: 86400,
    },
    {
      id: 'agent-3',
      name: 'Deploy Guard',
      model: 'deepseek-v4',
      status: 'idle',
      totalSessions: 412,
      totalTokens: 2300000,
      totalToolCalls: 5600,
      uptime: 172800,
    },
    {
      id: 'agent-4',
      name: 'Doc Writer',
      model: 'gpt-4o',
      status: 'offline',
      totalSessions: 56,
      totalTokens: 340000,
      totalToolCalls: 800,
      uptime: 0,
    },
  ];
}

export function generateDemoSessions(): SessionInfo[] {
  return [
    { id: 's1', agentId: 'agent-1', title: 'Add user auth middleware', messageCount: 34, toolCallCount: 18, tokenCount: 12500, createdAt: Date.now() - 3600000, lastActive: Date.now() - 600000 },
    { id: 's2', agentId: 'agent-1', title: 'Fix CORS errors in API', messageCount: 22, toolCallCount: 10, tokenCount: 8500, createdAt: Date.now() - 7200000, lastActive: Date.now() - 3600000 },
    { id: 's3', agentId: 'agent-2', title: 'Research WebSocket libraries', messageCount: 15, toolCallCount: 8, tokenCount: 6200, createdAt: Date.now() - 10800000, lastActive: Date.now() - 5400000 },
    { id: 's4', agentId: 'agent-3', title: 'Deploy v2.3.1 to staging', messageCount: 45, toolCallCount: 25, tokenCount: 18000, createdAt: Date.now() - 14400000, lastActive: Date.now() - 7200000 },
    { id: 's5', agentId: 'agent-1', title: 'Write unit tests for auth', messageCount: 18, toolCallCount: 6, tokenCount: 4500, createdAt: Date.now() - 18000000, lastActive: Date.now() - 9000000 },
    { id: 's6', agentId: 'agent-2', title: 'Analyze Gemini API pricing', messageCount: 8, toolCallCount: 4, tokenCount: 3200, createdAt: Date.now() - 21600000, lastActive: Date.now() - 10800000 },
    { id: 's7', agentId: 'agent-3', title: 'Rollback v2.3.0', messageCount: 12, toolCallCount: 15, tokenCount: 9800, createdAt: Date.now() - 25200000, lastActive: Date.now() - 14400000 },
    { id: 's8', agentId: 'agent-4', title: 'Generate API documentation', messageCount: 28, toolCallCount: 5, tokenCount: 11000, createdAt: Date.now() - 28800000, lastActive: Date.now() - 18000000 },
  ];
}

export function generateDemoTokenUsage(): TokenUsage[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((date) => ({
    date,
    input: Math.floor(Math.random() * 50000) + 10000,
    output: Math.floor(Math.random() * 30000) + 5000,
  }));
}

export function generateDemoToolUsage(): ToolUsage[] {
  const tools = ['read_file', 'write_file', 'terminal', 'web_search', 'search_files', 'patch'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const result: ToolUsage[] = [];
  for (const day of days) {
    for (const tool of tools) {
      result.push({ tool, count: Math.floor(Math.random() * 30) + 1, day });
    }
  }
  return result;
}
