import type { Cpu } from '../domain/types';
import { CPU_OPTIONS } from '../domain/types';

interface CpuSelectProps {
  value: Cpu;
  onChange: (value: Cpu) => void;
}

export function CpuSelect({ value, onChange }: CpuSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="cpu" className="text-xs font-medium uppercase tracking-wide text-gray-600">
        CPU
      </label>
      <select
        id="cpu"
        value={value}
        onChange={(e) => onChange(e.target.value as Cpu)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        {CPU_OPTIONS.map((cpu) => (
          <option key={cpu} value={cpu}>
            {cpu}
          </option>
        ))}
      </select>
    </div>
  );
}
