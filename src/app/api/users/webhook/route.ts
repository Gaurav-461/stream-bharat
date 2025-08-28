import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    return new Response(
      "Error: Please add a CLERK_WEBHOOK_SIGNING_SECRET from clerk dashboard to .env or .env.local:",
      { status: 400 },
    );
  }

  // create svix instance with signing secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Error:- Could not verify webhook:", error);
    return new Response("Error:- verifying webhook", { status: 400 });
  }

  try {
    // Do something with payload
    // For this guide, log payload to console
    const clerkData = event.data as UserJSON;
    const eventType = event.type;

    // console.log(
    //   `✅ Received webhook with ID ${clerkData.id} and event type of ${eventType}`,
    // );
    // console.log("✅ Webhook payload:", event.data);

    if (eventType === "user.created") {
      await db.insert(users).values({
        clerkId: clerkData.id,
        name: `${clerkData.first_name} ${clerkData.last_name}`,
        imageUrl: clerkData.image_url,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    if (eventType === "user.updated") {
      if (!clerkData.id) {
        return new Response("Error: Missing user id", { status: 400 });
      }

      await db
        .update(users)
        .set({
          name: `${clerkData.first_name} ${clerkData.last_name}`,
          imageUrl: clerkData.image_url,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, clerkData.id));
    }

    if(eventType === "user.deleted") {
      if (!clerkData.id) {
        return new Response("Error: Missing user id", { status: 400 });
      }

      await db.delete(users).where(eq(users.clerkId, clerkData.id))
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error:- while processing clerk webhook:", err);
    return new Response("Error: while processing  webhook", { status: 400 });
  }
}
