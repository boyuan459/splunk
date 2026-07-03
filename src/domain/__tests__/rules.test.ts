import { describe, it, expect } from 'vitest';
import { evaluate } from '../rules';
import type { ServerConfig } from '../types';

const config = (over: Partial<ServerConfig>): ServerConfig => ({
  cpu: 'X86',
  memory: 4096,
  gpu: false,
  ...over,
});

describe('evaluate — spec examples', () => {
  it('Example 1: Power / 1,024MB / no GPU → No Options', () => {
    expect(evaluate(config({ cpu: 'Power', memory: 1024 }))).toEqual([]);
  });

  it('Example 2: Power / 262,144MB / no GPU → Tower, 4U, Mainframe', () => {
    expect(evaluate(config({ cpu: 'Power', memory: 262144 }))).toEqual([
      'Tower Server',
      '4U Rack Server',
      'Mainframe',
    ]);
  });

  it('Example 3: X86 / 524,288MB / no GPU → Tower, 4U', () => {
    expect(evaluate(config({ cpu: 'X86', memory: 524288 }))).toEqual([
      'Tower Server',
      '4U Rack Server',
    ]);
  });

  it('Example 4: ARM / 524,288MB / with GPU → High Density', () => {
    expect(evaluate(config({ cpu: 'ARM', memory: 524288, gpu: true }))).toEqual([
      'High Density Server',
    ]);
  });
});

describe('evaluate — GPU rule (Rule 1)', () => {
  it('ARM + memory exactly 524,288 + GPU → High Density', () => {
    expect(evaluate(config({ cpu: 'ARM', memory: 524288, gpu: true }))).toEqual([
      'High Density Server',
    ]);
  });

  it('ARM + memory below 524,288 + GPU → No Options', () => {
    expect(evaluate(config({ cpu: 'ARM', memory: 262144, gpu: true }))).toEqual([]);
  });

  it('non-ARM CPU + GPU → No Options even with huge memory', () => {
    expect(evaluate(config({ cpu: 'X86', memory: 8388608, gpu: true }))).toEqual([]);
    expect(evaluate(config({ cpu: 'Power', memory: 8388608, gpu: true }))).toEqual([]);
  });
});

describe('evaluate — no-GPU rules (Rules 2, 3, 4)', () => {
  it('memory below 2,048 → No Options (Rule 4)', () => {
    expect(evaluate(config({ memory: 1024 }))).toEqual([]);
  });

  it('memory exactly 2,048 → Tower only', () => {
    expect(evaluate(config({ cpu: 'X86', memory: 2048 }))).toEqual(['Tower Server']);
  });

  it('memory between 2,048 and 131,072 → Tower only (Rule 3)', () => {
    expect(evaluate(config({ cpu: 'X86', memory: 65536 }))).toEqual(['Tower Server']);
  });

  it('memory exactly 131,072 → Tower and 4U (Rule 3)', () => {
    expect(evaluate(config({ cpu: 'X86', memory: 131072 }))).toEqual([
      'Tower Server',
      '4U Rack Server',
    ]);
  });

  it('Power CPU adds Mainframe (Rule 2)', () => {
    expect(evaluate(config({ cpu: 'Power', memory: 2048 }))).toEqual([
      'Tower Server',
      'Mainframe',
    ]);
  });

  it('Power CPU never yields High Density without GPU (Rule 2)', () => {
    const result = evaluate(config({ cpu: 'Power', memory: 8388608 }));
    expect(result).not.toContain('High Density Server');
  });

  it('ARM without GPU behaves like a general CPU (no Mainframe, no High Density)', () => {
    expect(evaluate(config({ cpu: 'ARM', memory: 131072 }))).toEqual([
      'Tower Server',
      '4U Rack Server',
    ]);
  });
});
