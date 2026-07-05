import { useState } from 'react';
import type { Cpu, ServerModel } from '../domain/types';
import { parseMemory } from '../domain/validation';
import { formatMemoryInput } from '../domain/format';
import { evaluate } from '../domain/rules';
import { CpuSelect } from './CpuSelect';
import { MemoryInput } from './MemoryInput';
import { GpuCheckbox } from './GpuCheckbox';
import { OutputSection } from './OutputSection';

/**
 * Server Composer container. Holds the form state, validates memory on submit,
 * runs the pure rules engine, and shows the resulting server models (or the
 * validation error). No output is shown until the first successful submit.
 */
export function ServerComposer() {
  const [cpu, setCpu] = useState<Cpu>('X86');
  const [memoryRaw, setMemoryRaw] = useState('');
  const [gpu, setGpu] = useState(false);

  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<ServerModel[] | null>(null);

  // Any edit invalidates the last submission, so hide the previous result (and
  // any stale error) until the user submits again. Keeps the output in sync with
  // the form instead of describing a configuration that has since changed.
  function dismissOutput() {
    if (error) setError(undefined);
    if (result !== null) setResult(null);
  }

  function handleCpuChange(next: Cpu) {
    setCpu(next);
    dismissOutput();
  }

  function handleMemoryChange(raw: string) {
    setMemoryRaw(formatMemoryInput(raw));
    dismissOutput();
  }

  function handleGpuChange(next: boolean) {
    setGpu(next);
    dismissOutput();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const parsed = parseMemory(memoryRaw);
    if (!parsed.ok) {
      setError(parsed.error);
      setResult(null);
      return;
    }

    setError(undefined);
    setResult(evaluate({ cpu, memory: parsed.value, gpu }));
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Server Composer</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        {/* "row" of "columns": items-start keeps every column top-aligned, so the
            memory field's error can grow without shifting the CPU or GPU column. */}
        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-4">
          <div className="col-span-12 sm:col-span-3">
            <CpuSelect value={cpu} onChange={handleCpuChange} />
          </div>
          <div className="col-span-12 sm:col-span-4">
            <MemoryInput value={memoryRaw} onChange={handleMemoryChange} error={error} />
          </div>
          <div className="col-span-12 sm:col-span-5">
            <GpuCheckbox checked={gpu} onChange={handleGpuChange} />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-md border border-gray-300 bg-gray-100 px-6 py-2 font-medium text-gray-800 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Submit
        </button>
      </form>

      {result !== null ? <OutputSection models={result} /> : null}
    </div>
  );
}
