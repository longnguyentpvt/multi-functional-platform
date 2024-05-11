module.exports = {
  extends: "@shineyup/eslint-config/next",
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
