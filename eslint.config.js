const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  ...expoConfig,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: '19.2',
      },
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
];
