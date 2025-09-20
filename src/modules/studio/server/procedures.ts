import { z } from "zod";
import db from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq, and, or, lt, desc } from "drizzle-orm";

export const studioRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.dbUser;

      const data = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id),
                  ),
                )
              : undefined,
          ),
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        // Add 1 to the limit to check if there are more videos
        .limit(limit + 1);

      const hasMoreVideos = data.length > limit;
      // Remove the last item if there are more videos
      const items = hasMoreVideos ? data.slice(0, -1) : data;

      // Set next cursor to the last video if there are more videos
      const lastVideo = items[items.length - 1];

      const nextCursor = hasMoreVideos
        ? {
            id: lastVideo.id,
            updatedAt: lastVideo.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
