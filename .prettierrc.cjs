// .prettierrc.mjs
/** @type {import("prettier").Config} */
module.exports = {
    plugins: ['prettier-plugin-astro'],
    semi: true,
    singleQuote: false,
    printWidth: 80,
    trailingComma: 'none',
    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro',
            },
        },
    ],
}