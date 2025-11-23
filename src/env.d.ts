/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

export { };
interface User {
    userid: string;
    gender: 'male' | 'female' | 'other' | null;
    phone: string | null;
    age: number | null;
    role: 'client' | 'delivery' | null;
    is_online: boolean;
    is_available: boolean;
    current_vehicle: string | null; // Assuming this refers to the vehicle's ID
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    image_url: string | null;
}


declare global {
    namespace App {
        interface Locals extends ClerkLocals {
            userRole: "User" | "Domiciliary" | null;
            dataUser: User | null;
            orgId: string | null;
            userExistsAPI: boolean;
        }
    }
}

interface ImportMetaEnv {
    readonly PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    readonly CLERK_SECRET_KEY: string;
    readonly CLERK_WEBHOOK_SECRET: string;
    readonly ID_ORG_DOMICILIARY: string;
    readonly ID_ORG_CLIENT: string;
    readonly URL_LOCAL_BACKEND: string;
    readonly API_USERS: string;
    readonly API_ADDRESSES: string;
    readonly API_DELIVERY_REQUESTS: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}