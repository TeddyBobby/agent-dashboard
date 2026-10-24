import { describe, it, expect } from 'vitest';
import { formatTokens, formatUptime, timeAgo, heatCellStyle, formatCount, formatClock } from './format';

describe('formatTokens', () => {
  it('returns plain integers below 1000', () => {
    expect(formatTokens(0)).toBe('0');
    expect(formatTokens(500)).toBe('500');
    expect(formatTokens(999)).toBe('999');
  });

  it('abbreviates thousands with a K suffix', () => {
    expect(formatTokens(1000)).toBe('1.0K');
    expect(formatTokens(1500)).toBe('1.5K');
    expect(formatTokens(999000)).toBe('999.0K');
  });

  it('abbreviates millions with an M suffix', () => {
    expect(formatTokens(1000000)).toBe('1.0M');
    expect(formatTokens(2500000)).toBe('2.5M');
  });
});

describe('formatCount', () => {
  it('groups thousands with commas and leaves small values intact', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(804)).toBe('804');
    expect(formatCount(10706)).toBe('10,706');
    expect(formatCount(1234567)).toBe('1,234,567');
  });
});

describe('formatUptime', () => {
  it('renders zero as an em dash', () => {
    expect(formatUptime(0)).toBe('—');
  });

  it('renders sub-hour uptime in minutes', () => {
    expect(formatUptime(60)).toBe('1m');
    expect(formatUptime(900)).toBe('15m');
  });

  it('renders hour-plus uptime as Hh Mm', () => {
    expect(formatUptime(3600)).toBe('1h 0m');
    expect(formatUptime(3660)).toBe('1h 1m');
  });

  it('renders day-plus uptime as Dd Hh', () => {
    expect(formatUptime(86400)).toBe('1d 0h');
    expect(formatUptime(90061)).toBe('1d 1h');
    expect(formatUptime(259200)).toBe('3d 0h');
  });
});

describe('timeAgo', () => {
  const now = 1_000_000_000_000;

  it('labels timestamps under a minute old as 刚刚', () => {
    expect(timeAgo(now - 30_000, now)).toBe('刚刚');
    expect(timeAgo(now, now)).toBe('刚刚');
  });

  it('labels minute-old timestamps', () => {
    expect(timeAgo(now - 5 * 60_000, now)).toBe('5 分钟前');
  });

  it('labels hour-old timestamps', () => {
    expect(timeAgo(now - 2 * 3_600_000, now)).toBe('2 小时前');
  });

  it('labels day-old timestamps', () => {
    expect(timeAgo(now - 3 * 86_400_000, now)).toBe('3 天前');
  });
});

describe('formatClock', () => {
  it('renders a locale-independent 24-hour HH:MM:SS clock', () => {
    expect(formatClock(new Date(2026, 0, 1, 14, 32, 5).getTime())).toBe('14:32:05');
  });

  it('zero-pads single-digit hours, minutes and seconds', () => {
    expect(formatClock(new Date(2026, 0, 1, 9, 5, 3).getTime())).toBe('09:05:03');
  });

  it('renders midnight as 00:00:00', () => {
    expect(formatClock(new Date(2026, 0, 1, 0, 0, 0).getTime())).toBe('00:00:00');
  });
});

describe('heatCellStyle', () => {
  it('keeps a minimum alpha and no explicit text colour for zero counts', () => {
    expect(heatCellStyle(0, 0)).toEqual({
      backgroundColor: 'rgba(59, 130, 246, 0.080)',
      color: undefined,
    });
  });

  it('scales alpha with the count/max ratio', () => {
    expect(heatCellStyle(10, 20).backgroundColor).toBe('rgba(59, 130, 246, 0.540)');
    expect(heatCellStyle(10, 20).color).toBeUndefined();
  });

  it('reaches full alpha and white text at the maximum', () => {
    expect(heatCellStyle(20, 20)).toEqual({
      backgroundColor: 'rgba(59, 130, 246, 1.000)',
      color: '#ffffff',
    });
  });

  it('switches text to white once the background is dark enough', () => {
    expect(heatCellStyle(15, 20).color).toBe('#ffffff');
  });
});
