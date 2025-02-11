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