/* eslint-env node */

module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals', // Next.js + TypeScript + React 규칙
    'prettier', // eslint-config-prettier: Prettier와 충돌하는 규칙 비활성화
  ],
  plugins: [
    'prettier', // eslint-plugin-prettier
    'unused-imports', // eslint-plugin-unused-imports
  ],
  rules: {
    // Prettier 규칙을 ESLint 에러로 표시
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

    // 사용하지 않는 import 제거
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
