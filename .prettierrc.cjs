// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
    plugins: ['prettier-plugin-astro'],
    semi: true,
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
};