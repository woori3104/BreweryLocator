module.exports = {
    root: true,
    env: {
      browser: true,
      node: true
    },
    parserOptions: {
      parser: 'babel-eslint'
    },
    extends: [
      '@nuxtjs',
      'plugin:nuxt/recommended',
      'plugin:prettier/recommended' // Prettier 규칙을 ESLint에 추가
    ],
    plugins: [
      'prettier'
    ],
    // add your custom rules here
    rules: {
      'prettier/prettier': ['error', { singleQuote: true, semi: false }] // 예시로 Prettier 규칙 수정
    }
  }
  