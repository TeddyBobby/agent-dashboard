import { describe, it, expect } from 'vitest';
import {
  generateDemoAgents,
  generateDemoSessions,
  generateDemoTokenUsage,
  generateDemoToolUsage,
} from './types';

describe('demo data generators', () => {
  it('produces a stable set of agents', () => {
    const agents = generateDemoAgents();
    expect(agents).toHaveLength(4);
    expect(agents.map((a) => a.id)).toEqual(['agent-1', 'agent-2', 'agent-3', 'agent-4']);
    // Every status is one of the four recognised values.
    const valid = ['online', 'busy', 'idle', 'offline'];
    agents.forEach((a) => expect(valid).toContain(a.status));
  });

  it('produces a stable set of sessions referencing known agents', () => {
    const sessions = generateDemoSessions();
    const agentIds = new Set(generateDemoAgents().map((a) => a.id));
    expect(sessions).toHaveLength(8);
    sessions.forEach((s) => expect(agentIds).toContain(s.agentId));
  });

  it('returns one token-usage entry per day of the week', () => {
    const usage = generateDemoTokenUsage();
    expect(usage).toHaveLength(7);
    expect(usage.map((d) => d.date)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  it('returns one tool-usage entry per tool × weekday', () => {
    const usage = generateDemoToolUsage();
    expect(usage).toHaveLength(30); // 6 tools × 5 weekdays
    const keys = new Set(usage.map((t) => `${t.tool}:${t.day}`));
    expect(keys.size).toBe(30); // no duplicate tool/day pairs
  });

  it('is deterministic across calls (SSG/hydration safety)', () => {
    // The generators are seeded, so server prerender and client hydration
    // must observe identical data. Two calls must deep-equal.
    expect(generateDemoTokenUsage()).toEqual(generateDemoTokenUsage());
    expect(generateDemoToolUsage()).toEqual(generateDemoToolUsage());
    expect(generateDemoAgents()).toEqual(generateDemoAgents());
  });

  it('is stable for a given seed', () => {
    expect(generateDemoTokenUsage(42)).toEqual(generateDemoTokenUsage(42));
    expect(generateDemoToolUsage(42)).toEqual(generateDemoToolUsage(42));
  });

  it('rotates to a different dataset when the seed changes', () => {
    // A rotated seed must yield visibly different metrics so a "live refresh"
    // actually changes the charts rather than re-rendering identical data.
    expect(generateDemoTokenUsage(1)).not.toEqual(generateDemoTokenUsage(2));
    expect(generateDemoToolUsage(1)).not.toEqual(generateDemoToolUsage(2));
  });
});
