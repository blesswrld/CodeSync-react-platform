import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import {
    WebhookEvent,
    UserJSON,
    DeletedObjectJSON,
} from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api, internal } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("CLERK_WEBHOOK_SECRET not set");
            return new Response(
                "Internal Server Error: Webhook secret not configured",
                { status: 500 }
            );
        }

        const svix_id = request.headers.get("svix-id");
        const svix_timestamp = request.headers.get("svix-timestamp");
        const svix_signature = request.headers.get("svix-signature");

        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.warn("Missing svix headers");
            return new Response("Error occured: Missing svix headers", {
                status: 400,
            });
        }

        const body = await request.text();
        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent;
        } catch (err: any) {
            console.error("Error verifying webhook:", err.message);
            return new Response("Error occured: Webhook verification failed", {
                status: 400,
            });
        }

        const eventType = evt.type;
        console.log(`Received Clerk webhook: ${eventType}`);

        try {
            if (eventType === "user.created") {
                const userData = evt.data as UserJSON;
                const email = userData.email_addresses[0]?.email_address;
                const name =
                    `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
                    userData.username ||
                    "Unnamed User";

                await ctx.runMutation(api.users.syncUser, {
                    clerkId: userData.id,
                    email: email || "",
                    name: name,
                    image: userData.image_url,
                });
                console.log(`User created/synced: ${userData.id}`);
            } else if (eventType === "user.updated") {
                const userData = evt.data as UserJSON;
                const email = userData.email_addresses[0]?.email_address;
                const name =
                    `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
                    userData.username ||
                    undefined;

                await ctx.runMutation(internal.users.updateUserWebhook, {
                    clerkId: userData.id,
                    ...(name !== undefined && { name }),
                    ...(email && { email }),
                    image: userData.image_url,
                });
                console.log(`User updated: ${userData.id}`);
            } else if (eventType === "user.deleted") {
                const deletedData = evt.data as DeletedObjectJSON;
                if (
                    deletedData.object === "user" &&
                    deletedData.id &&
                    deletedData.deleted
                ) {
                    await ctx.runMutation(internal.users.deleteUserWebhook, {
                        clerkId: deletedData.id,
                    });
                    console.log(`User deleted: ${deletedData.id}`);
                } else {
                    console.warn(
                        `Received user.deleted event for non-user object or without id/deleted=true. Data:`,
                        deletedData
                    );
                }
            }
        } catch (error: any) {
            console.error(
                `Error processing webhook event ${eventType}:`,
                error.message
            );
            return new Response(`Error processing event: ${eventType}`, {
                status: 500,
            });
        }
        return new Response("Webhook processed successfully", { status: 200 });
    }),
});

export default http;
