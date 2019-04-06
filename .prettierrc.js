module.exports = {
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    overrides: [
        {
            files: '*.(js|jsx|ts|tsx|vue)',
            options: {
                trailingComma: 'es5',
            },
        },
    ],
    bracketSpacing: true,
    arrowParens: 'avoid',
    proseWrap: 'preserve',
    htmlWhitespaceSensitivity: 'css',
    endOfLine: 'lf',
};
