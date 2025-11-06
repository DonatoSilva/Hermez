import { createClerkClient } from "@clerk/astro/server";
import { type APIRoute } from "astro";
import { CLERK_SECRET_KEY, getSecret } from "astro:env/server";
import { Webhook } from "svix";
import type { UserCreatedEvent } from "../../../types/clerkType";

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
    } const type = evt.type;
    const data = evt.data;

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
        const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });

        try {
            // Add user to both organizations
            await Promise.all([
                clerkClient.organizations.createOrganizationMembership({
                    organizationId: getSecret("ID_ORG_DOMICILIARY")!,
                    userId: userId,
                    role: "org:member"
                }),
                clerkClient.organizations.createOrganizationMembership({
                    organizationId: getSecret("ID_ORG_CLIENT")!,
                    userId: userId,
                    role: "org:member"
                })
            ]);
        } catch (err) {
            console.error('Error creating organization memberships:', err);
            return new Response('Error creating organization memberships', { status: 500 });
        } return new Response("User successfully added to both organizations", {
            status: 200,
            headers: {
                "Content-Type": "text/plain"
            }
        });
    }

    return new Response("Something went wrong", {
        status: 500,
        headers: {
            "Content-Type": "text/plain"
        }
    });
}