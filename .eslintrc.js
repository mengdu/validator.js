module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: 'standard',
  plugins: [
    "@typescript-eslint"
  ],
  rules: {}
}
