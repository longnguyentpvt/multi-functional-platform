/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: "@shineyup",
  ignorePatterns: ['**/{node_modules,lib,dist}', '**/.eslintrc.js', '**/*.config.js'],
  parserOptions: {
    project: "./tsconfig.json"
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json"
      }
    }
  }
};
