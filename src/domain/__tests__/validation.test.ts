import { describe, it, expect } from 'vitest';
import { parseMemory, MAX_MEMORY_MB } from '../validation';

describe('parseMemory', () => {
  it('accepts a comma-grouped power of two', () => {
    expect(parseMemory('262,144')).toEqual({ ok: true, value: 262144 });
  });

  it('accepts a value without commas', () => {
    expect(parseMemory('4096')).toEqual({ ok: true, value: 4096 });
  });

  it('accepts the minimum reproducible example value 1,024', () => {
    // Example 1 in the spec submits 1,024MB; format is valid, rules yield No Options.
    expect(parseMemory('1,024')).toEqual({ ok: true, value: 1024 });
  });

  it('accepts the documented upper bound 8,388,608', () => {
    expect(parseMemory('8,388,608')).toEqual({ ok: true, value: MAX_MEMORY_MB });
  });

  it('rejects a value above the upper bound', () => {
    const result = parseMemory('16,777,216');
    expect(result.ok).toBe(false);
  });

  it('rejects a non power of two', () => {
    const result = parseMemory('3,072');
    expect(result.ok).toBe(false);
  });

  it('rejects a power of two that is not a multiple of 1024', () => {
    // 512 and 256 are powers of two but not multiples of 1024.
    expect(parseMemory('512').ok).toBe(false);
    expect(parseMemory('256').ok).toBe(false);
    expect(parseMemory('2').ok).toBe(false);
  });

  it('rejects an empty string', () => {
    const result = parseMemory('');
    expect(result.ok).toBe(false);
  });

  it('rejects whitespace-only input', () => {
    const result = parseMemory('   ');
    expect(result.ok).toBe(false);
  });

  it('rejects non-numeric junk', () => {
    const result = parseMemory('abc');
    expect(result.ok).toBe(false);
  });

  it('rejects a decimal value', () => {
    const result = parseMemory('4096.5');
    expect(result.ok).toBe(false);
  });

  it('rejects zero and negative values', () => {
    expect(parseMemory('0').ok).toBe(false);
    expect(parseMemory('-4096').ok).toBe(false);
  });

  it('returns an error message when invalid', () => {
    const result = parseMemory('3,072');
    if (result.ok) throw new Error('expected failure');
    expect(result.error).toBeTruthy();
    expect(typeof result.error).toBe('string');
  });
});
