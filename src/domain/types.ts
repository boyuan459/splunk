export type Cpu = 'X86' | 'Power' | 'ARM';

export const CPU_OPTIONS: readonly Cpu[] = ['X86', 'Power', 'ARM'];

export type ServerModel =
  | 'Tower Server'
  | '4U Rack Server'
  | 'Mainframe'
  | 'High Density Server';

export interface ServerConfig {
  cpu: Cpu;
  /** Memory size in MB (already parsed to an integer). */
  memory: number;
  gpu: boolean;
}
