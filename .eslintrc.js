module.exports = {
    root: true,
    env: {
        node: true,
    },
    plugins: ['prettier', 'vue'],
    extends: [
        '@vue/airbnb',
        'plugin:vue/recommended',
        'prettier',
        'prettier/standard',
        'prettier/vue',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-expressions': [
            'error',
            {
                allowTernary: true,
                allowShortCircuit: true,
                allowTaggedTemplates: true,
            },
        ],
        vue: {
            'script-indent': [
                'warning',
                4,
                {
                    baseIndent: 1,
                },
            ],
        },
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
