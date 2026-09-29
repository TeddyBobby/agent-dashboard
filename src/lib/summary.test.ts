import { describe, it, expect } from 'vitest';
import { summarizeAgents } from './summary';
import { generateDemoAgents } from './types';
import type { AgentInfo } from './types';

describe('summarizeAgents', () => {
  it('returns a zeroed summary for an empty list', () => {
    expect(summarizeAgents([])).toEqual({
      total: 0,
      active: 0,
      idle: 0,
      offline: 0,
      totalSessions: 0,
      totalTokens: 0,
      totalToolCalls: 0,
    });
  });

  it('counts agents by status and sums cumulative counters', () => {
    const agents: AgentInfo[] = [
      { id: 'a', name: 'A', model: 'm', status: 'online', totalSessions: 10, totalTokens: 100, totalToolCalls: 5, uptime: 60 },
      { id: 'b', name: 'B', model: 'm', status: 'busy', totalSessions: 20, totalTokens: 200, totalToolCalls: 6, uptime: 60 },
      { id: 'c', name: 'C', model: 'm', status: 'idle', totalSessions: 30, totalTokens: 300, totalToolCalls: 7, uptime: 60 },
      { id: 'd', name: 'D', model: 'm', status: 'offline', totalSessions: 40, totalTokens: 400, totalToolCalls: 8, uptime: 0 },
    ];

    const s = summarizeAgents(agents);
    expect(s.total).toBe(4);
    expect(s.active).toBe(2); // online + busy
    expect(s.idle).toBe(1);
    expect(s.offline).toBe(1);
    expect(s.totalSessions).toBe(100);
    expect(s.totalTokens).toBe(1000);
    expect(s.totalToolCalls).toBe(26);
  });

  it('aggregates the demo dataset correctly', () => {
    const s = summarizeAgents(generateDemoAgents());

    expect(s.total).toBe(4);
    expect(s.active).toBe(2); // 'busy' + 'online'
    expect(s.idle).toBe(1);
    expect(s.offline).toBe(1);
    // 247 + 89 + 412 + 56
    expect(s.totalSessions).toBe(804);
    // 1,850,000 + 620,000 + 2,300,000 + 340,000
    expect(s.totalTokens).toBe(5_110_000);
    // 3,204 + 1,102 + 5,600 + 800
    expect(s.totalToolCalls).toBe(10_706);
  });
});
