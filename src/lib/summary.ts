import type { AgentInfo } from './types';

// Aggregate a list of agents into a single at-a-glance summary.
//
// `totalToolCalls` (and the other cumulative counters) were tracked on each
// agent but never surfaced anywhere in the UI. Extracting the aggregation into
// a pure, side-effect-free function makes those numbers reachable by a KPI
// strip today and reusable by any future server-side data layer tomorrow.

export interface AgentSummary {
  total: number;
  active: number; // online + busy
  idle: number;
  offline: number;
  totalSessions: number;
  totalTokens: number;
  totalToolCalls: number;
}

const ACTIVE_STATUSES = new Set(['online', 'busy']);

export function summarizeAgents(agents: AgentInfo[]): AgentSummary {
  let active = 0;
  let idle = 0;
  let offline = 0;
  let totalSessions = 0;
  let totalTokens = 0;
  let totalToolCalls = 0;

  for (const agent of agents) {
    if (ACTIVE_STATUSES.has(agent.status)) active += 1;
    else if (agent.status === 'idle') idle += 1;
    else if (agent.status === 'offline') offline += 1;

    totalSessions += agent.totalSessions;
    totalTokens += agent.totalTokens;
    totalToolCalls += agent.totalToolCalls;
  }

  return {
    total: agents.length,
    active,
    idle,
    offline,
    totalSessions,
    totalTokens,
    totalToolCalls,
  };
}
