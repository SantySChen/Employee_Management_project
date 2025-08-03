module.exports = {
    env: {
        es2024: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'es2024',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
}