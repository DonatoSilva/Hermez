import { Clerk } from "@clerk/clerk-js";
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "astro:env/client";
import { navigate } from "astro:transitions/client";

const clerk = new Clerk(PUBLIC_CLERK_PUBLISHABLE_KEY);


export const handleOrganizationSelect = async (organizationId) => {
    await clerk.load()
    await clerk.setActive({ organization: organizationId }).then(
        () => navigate("/")
    );
};
