import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.agents/**',
    '.agent/**',
    '.git/**',
    '.kiro/**',
    '.home/**',
    '.opencode/**',
    '.next/**',
    '_bmad/**',
    '_bmad-output/**',
    'build/**',
    'design-artifacts/**',
    'docs/**',
    'node_modules/**',
    'out/**',
    'public/**',
    'scripts/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
