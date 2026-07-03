import type { ServerConfig, ServerModel } from './types';

/** Memory thresholds (MB) that gate the server-model rules. */
export const MEMORY = {
  /** Rule 4: any model requires at least this much memory. */
  MIN: 2_048,
  /** Rule 3: at/above this, 4U Rack Server becomes available. */
  RACK_4U: 131_072,
  /** Rule 1: High Density Server requires at least this much memory. */
  HIGH_DENSITY: 524_288,
} as const;

/**
 * Determine which server models match a hardware configuration.
 *
 * Pure function — no side effects. Returns models in a stable display order;
 * an empty array means "No Options". See ASSUMPTIONS.md for the rule
 * interpretation and how it maps to the spec examples.
 */
export function evaluate(config: ServerConfig): ServerModel[] {
  const { cpu, memory, gpu } = config;

  // Rule 1: with a GPU Accelerator Card only High Density Server is possible,
  // and only for ARM with at least 524,288MB.
  if (gpu) {
    if (cpu === 'ARM' && memory >= MEMORY.HIGH_DENSITY) {
      return ['High Density Server'];
    }
    return [];
  }

  // Rule 4: below the 2,048MB floor nothing matches.
  if (memory < MEMORY.MIN) {
    return [];
  }

  const models: ServerModel[] = [];

  // The pushes below are additive, and Tower / 4U are CPU-agnostic — they apply
  // to every CPU, Power included. Rule 3: Tower Server is always available
  // at/above the floor; 4U Rack Server needs at least 131,072MB.
  models.push('Tower Server');
  if (memory >= MEMORY.RACK_4U) {
    models.push('4U Rack Server');
  }

  // Rule 2: Mainframe is the only Power-exclusive model, so we only *add* it for
  // Power on top of the Tower/4U already collected above. That is what gives a
  // Power CPU "every model except High Density" — not Mainframe alone.
  if (cpu === 'Power') {
    models.push('Mainframe');
  }

  return models;
}
