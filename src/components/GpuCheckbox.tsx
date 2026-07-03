interface GpuCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function GpuCheckbox({ checked, onChange }: GpuCheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Empty spacer the height of a field label, so the checkbox lines up with
          the CPU/Memory inputs rather than their labels. */}
      <span aria-hidden className="text-xs font-medium uppercase tracking-wide">
        &nbsp;
      </span>
      <label htmlFor="gpu" className="flex cursor-pointer items-center gap-2 py-2.5">
        <input
          id="gpu"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
        />
        <span className="text-gray-900">GPU Accelerator Card</span>
      </label>
    </div>
  );
}
