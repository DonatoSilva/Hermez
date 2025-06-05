import { type APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { Webhook } from "svix";
import { type UserCreatedEvent } from "src/types/clerk";
import { createClerkClient } from "@clerk/astro/server";

export const POST: APIRoute = async ({ request }: { request: Request }) => {
    const payload = await request.text();
    const headers = Object.fromEntries(request.headers);

    const secret = import.meta.env.CLERK_WEBHOOK_SECRET;
    const wh = new Webhook(secret);

    let evt: UserCreatedEvent;

    try {
        evt = wh.verify(payload, headers) as UserCreatedEvent;
    } catch (err) {
        console.error('Webhook no verificado:', err);
        return new Response('Webhook inválido', { status: 400 });
    }

    const type = evt.type;
    const data = evt.data;
    const unsafeMetadata = data.unsafe_metadata;
    const org = unsafeMetadata.org;

    if (org !== 'Domiciliary' && org !== 'Client') {
        return new Response("Invalid organization type. Must be 'Domiciliary' or 'Client'", {
            status: 400,
            headers: {
                "Content-Type": "text/plain"
            }
        });
    }

    if (!type) {
        return new Response("Type is required", {
            status: 400,
            headers: {
                "Content-Type": "text/plain"
            }
        });
    }

    if (type === "user.created") {
        const userId = data.id;
        const clerkClient = createClerkClient({ secretKey: import.meta.env.CLERK_SECRET_KEY });

        if (org === "Domiciliary") {
            await clerkClient.organizations.createOrganizationMembership({
                organizationId: getSecret("DOMICILIARY_ORG_ID")!,
                userId: userId,
                role: "org:member"
            }).catch((err) => {
                console.error('Error creating organization membership:', err);
                return new Response('Error creating organization membership', { status: 500 });

            });
        }

        if (org === "Client") {
            await clerkClient.organizations.createOrganizationMembership({
                organizationId: getSecret("CLIENT_ORG_ID")!,
                userId: userId,
                role: "org:member"
            }).catch((err) => {
                console.error('Error creating organization membership:', err);
                return new Response('Error creating organization membership', { status: 500 });

            });
        }
    }

    return new Response("Role successfully updated", {
        status: 200,
        headers: {
            "Content-Type": "text/plain"
        }
    });
}