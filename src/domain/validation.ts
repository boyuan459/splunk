/**
 * Upper bound of the memory range documented in the task (8,388,608MB = 2^23).
 */
export const MAX_MEMORY_MB = 8_388_608;

export type MemoryParseResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

/**
 * Parse a user-entered memory size.
 *
 * Accepts a comma-grouped positive integer (e.g. "262,144"). The value must be
 * a multiple of 1024, a power of two, and no greater than {@link MAX_MEMORY_MB}.
 * Magnitude thresholds that decide which server models match
 * (2,048 / 131,072 / 524,288) are handled by the rules engine, not here — see
 * ASSUMPTIONS.md.
 */
export function parseMemory(raw: string): MemoryParseResult {
  const trimmed = raw.trim();
  if (trimmed === '') {
    return { ok: false, error: 'Memory size is required.' };
  }

  // Only digits and comma separators are allowed.
  if (!/^[0-9,]+$/.test(trimmed)) {
    return {
      ok: false,
      error: 'Memory must be a comma-separated integer (MB), e.g. 262,144.',
    };
  }

  const value = Number(trimmed.replace(/,/g, ''));
  if (!Number.isInteger(value) || value <= 0) {
    return { ok: false, error: 'Memory must be a positive integer (MB).' };
  }

  if (value % 1024 !== 0) {
    return { ok: false, error: 'Memory must be a multiple of 1,024 MB.' };
  }

  if (!isPowerOfTwo(value)) {
    return { ok: false, error: 'Memory must be a power of 2 (e.g. 2,048, 4,096).' };
  }

  if (value > MAX_MEMORY_MB) {
    return {
      ok: false,
      error: `Memory must not exceed ${MAX_MEMORY_MB.toLocaleString()}MB.`,
    };
  }

  return { ok: true, value };
}
