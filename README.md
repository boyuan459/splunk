# Server Composer

A frontend-only React + TypeScript application that determines the possible
**Server Model Options** for a hardware configuration. Choose a CPU, enter a
memory size, indicate whether a GPU Accelerator Card is required, and click
**Submit** to see the matching server models (or "No Options").

Built for the Splunk PSP Fullstack Engineer task.

## Tech stack

- **React 18 + TypeScript**
- **Vite** — dev server & build
- **Tailwind CSS** — styling
- **Vitest + React Testing Library** — unit & component tests

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
```

## Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the Vite dev server                    |
| `npm test`          | Run the full test suite once                 |
| `npm run test:watch`| Run tests in watch mode                      |
| `npm run build`     | Type-check and produce a production build    |
| `npm run preview`   | Preview the production build locally         |
| `npm run lint`      | Type-check without emitting                  |

## How it works

The domain logic is intentionally decoupled from React so it can be tested and
reasoned about in isolation:

```
src/
  domain/
    types.ts        # Cpu, ServerModel, ServerConfig
    validation.ts   # parseMemory(): format & bounds checking
    rules.ts        # evaluate(config): pure server-model rules engine
  components/
    ServerComposer.tsx  # form state + submit orchestration
    CpuSelect.tsx  MemoryInput.tsx  GpuCheckbox.tsx  OutputSection.tsx
  App.tsx  main.tsx  index.css
```

### The rules (`evaluate`)

- **GPU checked** → only **High Density Server**, and only when CPU = ARM **and**
  memory ≥ 524,288MB; otherwise **No Options**.
- **GPU unchecked:**
  - memory < 2,048MB → **No Options**
  - **Tower Server** — available at memory ≥ 2,048MB
  - **4U Rack Server** — available at memory ≥ 131,072MB
  - **Mainframe** — available when CPU = Power

### Memory input

Accepts a comma-grouped power of two (e.g. `262,144`) up to `8,388,608`MB.
Non-numeric, non-power-of-2, or out-of-range values show an inline error and
block submit. See [`ASSUMPTIONS.md`](./ASSUMPTIONS.md) for the reasoning behind
the validation strategy and how the spec's stated range is reconciled with the
provided examples.

## Testing

```bash
npm test
```

### Testing single file once

```bash
npm test -- src/components/__tests__/ServerComposer.test.tsx
```

Coverage includes:

- `domain/__tests__/validation.test.ts` — parsing, power-of-two, bounds, junk.
- `domain/__tests__/rules.test.ts` — all four spec examples plus boundary cases.
- `components/__tests__/ServerComposer.test.tsx` — full submit→output cycles,
  the "No Options" path, and validation errors.

## Assumptions

Business-logic ambiguities and the decisions made are documented in
[`ASSUMPTIONS.md`](./ASSUMPTIONS.md).
