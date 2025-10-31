import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist', 'node_modules'],
    rules: {
      indent: ['error', 2], // 🔹 indent 2 spasi
      'no-unused-vars': 'off', // matikan versi JS
      '@typescript-eslint/no-unused-vars': ['warn'], // aktifkan versi TS
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-constant-condition': 'off'
    }
  }
];
