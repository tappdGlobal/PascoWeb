import { describe, it, expect } from 'vitest'
import { revenueForRange, countForRange, buildRevenueSummary } from '../src/utils/revenue'

describe('revenue utils', () => {
  const jobs = [
    { id: 1, createdAt: new Date().toISOString(), billAmount: 1000 },
    { id: 2, createdAt: new Date().toISOString(), billAmount: 2000 },
    { id: 3, createdAt: new Date(Date.now() - 24*60*60*1000).toISOString(), billAmount: 500 },
  ];

  it('counts jobs in range and sums revenue', () => {
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today.getTime() + 24*60*60*1000);
    const rev = revenueForRange(jobs, today, tomorrow);
    const cnt = countForRange(jobs, today, tomorrow);
    expect(cnt).toBe(2);
    expect(rev).toBe(3000);
  });

  it('builds a summary array', () => {
    const summary = buildRevenueSummary(jobs);
    expect(Array.isArray(summary)).toBeTruthy();
    expect(summary[0].period).toBe('Today');
    expect(typeof summary[0].avgPerJob).toBe('number');
  });
});
