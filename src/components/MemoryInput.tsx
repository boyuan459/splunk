import { useLayoutEffect, useRef } from 'react';

interface MemoryInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function MemoryInput({ value, onChange, error }: MemoryInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Number of digits that were to the left of the caret at the last keystroke.
  // Tracking digits (not character index) survives the comma reflow.
  const caretDigitsRef = useRef<number | null>(null);

  // After the reformatted value is painted, restore the caret to sit just after
  // the same digit it was after before formatting.
  useLayoutEffect(() => {
    const el = inputRef.current;
    const targetDigits = caretDigitsRef.current;
    if (!el || targetDigits === null) return;
    caretDigitsRef.current = null;

    let pos = 0;
    let seen = 0;
    while (pos < value.length && seen < targetDigits) {
      if (/\d/.test(value[pos])) seen++;
      pos++;
    }
    el.setSelectionRange(pos, pos);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const el = e.target;
    const caret = el.selectionStart ?? el.value.length;
    caretDigitsRef.current = el.value.slice(0, caret).replace(/\D/g, '').length;
    onChange(el.value);
  }

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
          ref={inputRef}
          id="memory"
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
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
