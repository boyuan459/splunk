/**
 * Format raw memory input for display: keep only digits, drop leading zeros,
 * and insert thousands separators (e.g. "2048" -> "2,048"). Empty or
 * digit-less input yields an empty string.
 *
 * The comma-grouped output stays compatible with `parseMemory` (in
 * validation.ts), which strips commas before validating.
 */
export function formatMemoryInput(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits === '') return '';

  const normalized = digits.replace(/^0+(?=\d)/, '');
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
