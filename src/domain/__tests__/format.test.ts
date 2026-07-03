import { describe, it, expect } from 'vitest';
import { formatMemoryInput } from '../format';

describe('formatMemoryInput', () => {
  it('groups a 4-digit value with a comma', () => {
    expect(formatMemoryInput('2048')).toBe('2,048');
  });

  it('groups a 6-digit value', () => {
    expect(formatMemoryInput('262144')).toBe('262,144');
  });

  it('groups a 7-digit value with two commas', () => {
    expect(formatMemoryInput('8388608')).toBe('8,388,608');
  });

  it('leaves values under 1,000 ungrouped', () => {
    expect(formatMemoryInput('512')).toBe('512');
  });

  it('re-groups a value that already contains commas', () => {
    expect(formatMemoryInput('2,048')).toBe('2,048');
  });

  it('strips non-digit characters', () => {
    expect(formatMemoryInput('2a0b4c8')).toBe('2,048');
  });

  it('returns an empty string for empty input', () => {
    expect(formatMemoryInput('')).toBe('');
  });

  it('returns an empty string when there are no digits', () => {
    expect(formatMemoryInput('abc')).toBe('');
  });

  it('drops leading zeros but keeps a lone zero', () => {
    expect(formatMemoryInput('02048')).toBe('2,048');
    expect(formatMemoryInput('0')).toBe('0');
  });
});
