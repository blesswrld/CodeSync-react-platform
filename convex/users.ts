import { v } from "convex/values";
import {
    internalMutation,
    query,
    mutation,
    MutationCtx,
} from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { api } from "./_generated/api";

// --- QUERIES ---
export const getUsers = query({
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        if (!args.clerkId) return null;
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();
    },
});

// --- MUTATIONS ---
export const syncUser = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        image: v.optional(v.string()),

        role: v.optional(
            v.union(v.literal("candidate"), v.literal("interviewer"))
        ),
    },
    handler: async (ctx: MutationCtx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        const userData = {
            clerkId: args.clerkId,
            email: args.email,
            name: args.name,
            image: args.image,
        };

        if (existingUser) {
            await ctx.db.patch(existingUser._id, {
                ...userData,

                ...(args.role && args.role !== existingUser.role
                    ? { role: args.role }
                    : {}),
            });
            console.log(`User ${args.clerkId} updated via syncUser.`);
            return existingUser._id;
        } else {
            const defaultRole = args.role || "candidate";
            const userId = await ctx.db.insert("users", {
                ...userData,
                role: defaultRole,
            });
            console.log(
                `User ${args.clerkId} created via syncUser with role ${defaultRole}.`
            );
            return userId;
        }
    },
});

export const updateUserWebhook = internalMutation({
    args: {
        clerkId: v.string(),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        email: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (!user) {
            console.warn(
                `Webhook: User with clerkId ${args.clerkId} not found for update. Attempting to create.`
            );

            await ctx.runMutation(api.users.syncUser, {
                clerkId: args.clerkId,
                email: args.email || "unknown_via_update@example.com",
                name: args.name || "User (from update event)",
                image: args.image,
                role: "candidate",
            });
            return;
        }

        const updateData: Partial<
            Omit<Doc<"users">, "_id" | "_creationTime" | "clerkId" | "role">
        > = {};
        if (args.name !== undefined) updateData.name = args.name;
        if (args.image !== undefined) updateData.image = args.image;
        if (args.email !== undefined) updateData.email = args.email;

        if (Object.keys(updateData).length > 0) {
            await ctx.db.patch(user._id, updateData);
            console.log(`User ${args.clerkId} updated via updateUserWebhook.`);
        } else {
            console.log(
                `No data to update for user ${args.clerkId} via updateUserWebhook.`
            );
        }
    },
});

export const deleteUserWebhook = internalMutation({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (user) {
            await ctx.db.delete(user._id);
            console.log(`User ${args.clerkId} deleted via deleteUserWebhook.`);
        } else {
            console.warn(
                `Webhook: User with clerkId ${args.clerkId} not found for deletion.`
            );
        }
    },
});
