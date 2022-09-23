module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'prettier/prettier': [
            'error',
            {
                eslintIntegration: true,
                tabWidth: 4,
                printWidth: 800,
                singleQuote: true,
                semi: true,
                trailingComma: 'none',
                bracketSpacing: true,
                arrowParens: 'avoid',
                endOfLine: 'auto'
            }
        ]
    }
};