// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  // Replaces .eslintignore — build output and deps are not linted.
  { ignores: ['dist', 'node_modules'] },

  // Application + test source.
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      // Cast: react-hooks@7 types its `configs` in a shape TS doesn't accept as
      // an ESLint Plugin, though it loads fine at runtime.
      'react-hooks': /** @type {import('eslint').ESLint.Plugin} */ (reactHooks),
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      // The core value of adding ESLint here: verify hook dependency arrays and
      // rules-of-hooks (things tsc cannot catch). See MemoryInput's effect.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Build/tooling config files run in Node, not the browser.
  {
    files: ['*.{js,ts}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
    },
  },
);
