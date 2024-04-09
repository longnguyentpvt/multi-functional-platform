module.exports = {
  extends: [
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "airbnb/hooks",
    "next"
  ],
  plugins: ["@typescript-eslint", "eslint-plugin-import-helpers"],
  rules: {
    "comma-dangle": ["error", "never"],
    "key-spacing": [
      "error",
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    "max-len": ["error", { code: 120 }],
    quotes: ["error", "double"],
    "template-curly-spacing": [
      "error",
      "always"
    ],
    "react/jsx-filename-extension": [0, { extensions: [".tsx"] }],
    "react/jsx-curly-spacing": [
      "error",
      {
        when: "always",
        children: true
      }
    ],
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error",
    "@typescript-eslint/comma-dangle": ["error", "never"],
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/no-explicit-any": ["error"],
    "@typescript-eslint/explicit-module-boundary-types": ["error"],
    "@typescript-eslint/explicit-function-return-type": ["error"],
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-misused-promises": 0,
    "@typescript-eslint/no-floating-promises": 0,
    "@typescript-eslint/require-await": 0,
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: "enumMember", format: ["camelCase", "PascalCase", "UPPER_CASE"] },
      { selector: "typeAlias", format: ["PascalCase"] },
      { selector: "interface", format: ["PascalCase"] }
    ],
    "object-curly-spacing": "error",
    "@typescript-eslint/object-curly-spacing": ["error", "always"],
    "no-restricted-imports": [
      "error",
      { "patterns": ["../*"] }
    ],
    "import/no-unresolved": "error",
    "import-helpers/order-imports": [
      "error",
      {
        newlinesBetween: "always",
        groups: ["module", "/^@components/", "/^@utils/", "/^@styles/"]
      }
    ]
  },
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
