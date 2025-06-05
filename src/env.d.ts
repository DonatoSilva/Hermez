/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
    interface Domicile {
        email: string;
        emailVerified: boolean;
        displayName: string;
        uid: string;
    }


    interface Locals {
        isLoggedIn: boolean;
        domicile: Domicile | null;
    }
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