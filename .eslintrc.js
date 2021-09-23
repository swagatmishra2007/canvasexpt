module.exports = {
    env: {
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'standard'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint',
        'unused-imports'
    ],
    rules: {
        // plugins
        'unused-imports/no-unused-imports-ts': 'error',

        // possibly semantic
        'no-redeclare': 'off',
        'no-undef-init': 'off',
        'no-unneeded-ternary': 'off',
        'no-unused-vars': 'off',
        'no-use-before-define': 'off',
        'no-empty': 'off',
        'yoda': 'off',

        // syntactic
        'brace-style': 'off',
        'comma-dangle': 'off',
        'dot-notation': 'off',
        'generator-star-spacing': 'off',
        'indent': 'off',
        'multiline-ternary': 'off',
        'no-extra-semi': 'off',
        'no-lone-blocks': 'off',
        'no-multiple-empty-lines': 'off',
        'no-multi-spaces': 'off',
        'object-curly-newline': 'off',
        'operator-linebreak': 'off',
        'padded-blocks': 'off',
        'quotes': 'off',
        'quote-props': 'off',
        'semi': 'off',
        'space-before-function-paren': 'off',
        'spaced-comment': 'off',
        'yield-star-spacing': 'off',
    }
};
