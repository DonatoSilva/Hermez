/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
    interface Domicile {
        email: string;
        emailVerified: boolean;
    }

    interface Locals {
        isLoggedIn: boolean;
        domicile: Domicile | null;
    }
}