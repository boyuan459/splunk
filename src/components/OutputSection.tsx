import type { ServerModel } from '../domain/types';

interface OutputSectionProps {
  models: ServerModel[];
}

/**
 * Renders the result of a submitted configuration: either the list of matching
 * server models or "No Options" when the array is empty.
 */
export function OutputSection({ models }: OutputSectionProps) {
  return (
    <section className="mt-8 border-t border-gray-200 pt-6">
      <h2 className="text-lg font-bold text-gray-900">Server Model Options</h2>
      {models.length === 0 ? (
        <p className="mt-3 text-gray-700">No Options</p>
      ) : (
        <ul className="mt-3 space-y-1 pl-4 text-gray-800">
          {models.map((model) => (
            <li key={model} className="flex gap-2">
              <span aria-hidden>-</span>
              <span>{model}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
