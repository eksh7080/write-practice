/* eslint-env node */

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: "detect" // 리액트 버전 자동 감지
    }
  },
  plugins: ['@typescript-eslint', 'prettier', 'unused-imports'], // 린트 규칙에 사용할 플러그인들
  rules: {
    "unused-imports/no-unused-imports": "error", // 사용하지 않는 import 문 에러 표시
    "unused-imports/no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "varsIgnorePattern": "^_", // "_"로 시작하는 변수는 무시
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }
    ], // 사용하지 않는 import 문 제거

    // 린트 + 프리티어 같이 사용
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        useTabs: false,
        tabWidth: 2,
        trailingComma: 'all',
        printWidth: 120,
        bracketSpacing: true,
        arrowParens: 'avoid',
        endOfLine: 'auto',
      },
    ],
  },
};
