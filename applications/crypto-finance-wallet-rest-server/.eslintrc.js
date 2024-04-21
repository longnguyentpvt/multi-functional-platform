module.exports = {
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  plugins: ["@typescript-eslint", "eslint-plugin-import-helpers"],
  rules: {
    "class-methods-use-this" : "off",
    "comma-dangle": ["error", "never"],
    "key-spacing": [
      "error",
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    "max-len": ["error", { code: 120 }],
    "quotes": "off",
    "@typescript-eslint/quotes": ["error", "double"],
    "template-curly-spacing": [
      "error",
      "always"
    ],
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
    "import/no-useless-path-segments": ["error", {
      noUselessIndex: true,
    }],
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          "../../*",
          "../controllers",
          "../modules",
          "../services",
          "../utils",
          "../data",
        ] 
      }
    ],
    "import/no-unresolved": ["error", { ignore: ['^supertest/.+'], }],
    "import/prefer-default-export": "off",
    "import-helpers/order-imports": [
      "error",
      {
        newlinesBetween: "always",
        groups: [
          "module", 
          "/^@app/modules/", 
          "/^@app/controllers/", 
          "/^@app/services/", 
          "/^@app/utils/", 
          "/^@app/types/", 
          "/^@app/data/"
        ]
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
