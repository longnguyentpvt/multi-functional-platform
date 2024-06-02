module.exports = {
  extends: ["./index.js", "next"],
  rules: {
    "react/jsx-indent" : ["error", 2, { "checkAttributes": true }],
    "react/jsx-indent-props" : ["error", 2],
    "react/jsx-closing-bracket-location": [
      "error",
      "after-props"
    ],
    "react/jsx-curly-spacing": [
      "error",
      {
        "when": "always",
        "children": true
      }
    ],
    "react/jsx-tag-spacing": [
      "error",
      {
        "beforeSelfClosing": "always"
      }
    ],
    "react/jsx-filename-extension": [0, { extensions: [".tsx"] }]
  }
}