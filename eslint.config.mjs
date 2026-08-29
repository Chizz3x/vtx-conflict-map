import reactPlugin from 'eslint-plugin-react';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      react: reactPlugin,
      '@typescript-eslint': tseslint,
      import: importPlugin,
      prettier,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/destructuring-assignment': 'off',
      'react/no-array-index-key': 'off',
      'no-restricted-syntax': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'no-nested-ternary': 'off',
      'import/no-cycle': [2, { maxDepth: 1 }],
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-filename-extension': [
        2,
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
      'react/function-component-definition': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'import/extensions': 'off',
      'import/no-anonymous-default-export': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-underscore-dangle': 'off',
      'import/prefer-default-export': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/ban-types': 'warn',
      'no-restricted-imports': 'off',
      'no-restricted-exports': 'off',
      'no-plusplus': 'off',
      'no-param-reassign': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'react/jsx-no-duplicate-props': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      'no-multi-assign': 'off',
      'no-continue': 'off',
      'import/no-extraneous-dependencies': 'off',
      'guard-for-in': 'off',
      'react/prop-types': 'off',
      'import/no-dynamic-require': 'off',
      'global-require': 'off',
      'no-bitwise': 'off',
    },
  },
];
