import {existsSync, readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import tsParser from '@typescript-eslint/parser';

function pluginPath() {
  const here = dirname(fileURLToPath(import.meta.url));
  const dirs = [here, join(here, 'lib/iota/lint'), join(here, 'src/lib/iota/lint')];
  try {
    const alias = JSON.parse(readFileSync(join(here, 'components.json'), 'utf8')).aliases?.lib;
    if (alias) dirs.push(...['', 'src'].map(base => join(here, base, alias.replace(/^[@~]\//, ''), 'iota/lint')));
  } catch {}
  const found = dirs.map(dir => join(dir, 'plugin.mjs')).find(existsSync);
  if (!found) throw new Error('Iota lint: lib/iota/lint/plugin.mjs is missing. Run npx shadcn@latest add https://design.useiota.space/r/lint.json');
  return found;
}

const iota = (await import(pathToFileURL(pluginPath()).href)).default;

export default [
  {ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**', '**/out/**', '**/components/ui/**', '**/lib/iota/lint/**']},
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {parser: tsParser, parserOptions: {ecmaFeatures: {jsx: true}}},
    linterOptions: {reportUnusedDisableDirectives: 'off'},
    plugins: {iota},
    processor: 'iota/standalone',
    rules: iota.configs.app.rules,
  },
  {files: ['**/components/iota/{ui,ai}/**', '**/components/iota/icon.tsx', '**/lib/iota/**'], rules: iota.configs.source.rules},
];
