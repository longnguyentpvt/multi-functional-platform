module.exports = {
  extends: ["./index.js", "next"],
  rules: {
    "react/jsx-filename-extension": [0, { extensions: [".tsx"] }],
    "react/jsx-curly-spacing": [
      "error",
      {
        when: "always",
        children: true
      }
    ]
  }
}