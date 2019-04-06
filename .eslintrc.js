module.exports = {
    root: true,
    env: {
        node: true,
    },
    plugins: ['prettier'],
    extends: ['plugin:vue/essential', '@vue/airbnb', 'plugin:prettier/recommended'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: ['error', 4],
        'no-unused-expressions': [
            'error',
            {
                allowTernary: true,
                allowShortCircuit: true,
                allowTaggedTemplates: true,
            },
        ],
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
