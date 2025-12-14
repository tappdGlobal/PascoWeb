import { describe, it, expect } from 'vitest';
import { sanitizeHeader, mapRowToRaw, toSnakeCaseKeyMap } from '../src/utils/csvMapping';

describe('csvMapping utilities', () => {
  it('sanitizes headers correctly', () => {
    expect(sanitizeHeader(' Job Card No ')).toBe('job_card_no');
    expect(sanitizeHeader('Customer Name')).toBe('customer_name');
  });

  it('maps a row to raw sanitized keys', () => {
    const row = { 'Job Card No': 'J-123', 'Customer Name': 'Alice', 'Amount(₹)': '₹1,000' };
    const raw = mapRowToRaw(row);
    expect(raw.job_card_no).toBe('J-123');
    expect(raw.customer_name).toBe('Alice');
    expect(raw.amount).toBe('₹1,000');
  });

  it('converts camelCase keys to snake_case mapping', () => {
    const job = { jobCardNumber: 'J-1', labourAmt: '100', partAmt: '50', billAmount: '500', groupName: 'G1' };
    const s = toSnakeCaseKeyMap(job);
    expect(s.job_card_number).toBe('J-1');
    expect(s.labour_amt).toBe('100');
    expect(s.part_amt).toBe('50');
    expect(s.bill_amount).toBe('500');
    expect(s.group_name).toBe('G1');
  });
});
