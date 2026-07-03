interface MemoryInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function MemoryInput({ value, onChange, error }: MemoryInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="memory"
        className="text-xs font-medium uppercase tracking-wide text-gray-600"
      >
        Memory Size
      </label>
      <div
        className={`flex w-full items-center rounded-lg border bg-white shadow-sm focus-within:ring-2 focus-within:ring-gray-200 ${
          error ? 'border-red-400 focus-within:border-red-500' : 'border-gray-300 focus-within:border-gray-500'
        }`}
      >
        <input
          id="memory"
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="262,144"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'memory-error' : undefined}
          className="w-full rounded-lg bg-transparent px-4 py-2.5 text-gray-900 focus:outline-none"
        />
        <span className="px-3 text-sm font-medium text-gray-400">MB</span>
      </div>
      <div className="mt-1">
        {error ? (
          <p id="memory-error" role="alert" className="text-sm leading-5 text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
