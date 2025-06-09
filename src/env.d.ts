/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

import type { orgUser } from "./types/orgUser";

declare global {
    namespace App {
        interface Locals extends ClerkLocals { }
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