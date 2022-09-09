module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      sourceType: 'module',
    },
    plugins: [
      '@typescript-eslint/eslint-plugin',
      'import',
      'import-helpers',
      'unused-imports',
      'prettier',
    ],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:sonarjs/recommended',
      'prettier',
    ],
    root: true,
    env: {
      node: true,
      jest: true,
    },
    rules: {
      'prettier/prettier': 'error',
      'unused-imports/no-unused-imports': 'error',
      'import-helpers/order-imports': [
        'warn',
        {
          // example configuration
          newlinesBetween: 'always',
          // groups: ['module', '/^@shared/', ['parent', 'sibling', 'index']],
          groups: [
            '/^@nestjs/',
            'module',
            '/^(.*)service/',
            '/^@\\//',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc', ignoreCase: true },
        },
      ],
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/prefer-immediate-return': 'warn',
      'sonarjs/no-useless-catch': 'warn',
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/cognitive-complexity': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  };