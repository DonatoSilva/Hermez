/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
    interface Locals { }
}

interface ImportMetaEnv {
    readonly PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    readonly CLERK_SECRET_KEY: string;
    readonly CLERK_WEBHOOK_SECRET: string;
    readonly ID_ORG_DOMICILIARY: string;
    readonly ID_ORG_CLIENT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}