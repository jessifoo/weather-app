module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
    "jest/globals": true
  },
  extends: ["airbnb-base", "prettier", "plugin:prettier/recommended", "plugin:react/recommended", "plugin:jest/recommended", "plugin:jest/style"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react", "import", "prettier", "jest"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        bracketSpacing: true,
        singleQuote: true,
        trailingComma: "none"
      }
    ]
  }
};
