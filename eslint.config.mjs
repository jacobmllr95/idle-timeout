import eslint from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import tsEslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  {
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es6
      }
    },
    ignores: ['dist/*']
  },
  prettierConfig
);
