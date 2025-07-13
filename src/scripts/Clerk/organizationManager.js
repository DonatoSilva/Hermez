import { Clerk } from "@clerk/clerk-js";
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "astro:env/client";
import { navigate } from "astro:transitions/client";


export const handleOrganizationSelect = async (organizationId) => {

    if (!organizationId) {
        throw new Error('Organization ID is required');
    }

    const clerk = new Clerk(PUBLIC_CLERK_PUBLISHABLE_KEY);
    await clerk.load()
    await clerk.setActive({ organization: organizationId }).then(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("org");
        navigate(url.pathname);
    });
};
