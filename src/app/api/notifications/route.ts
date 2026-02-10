import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
} from "@/lib/api-utils";

/**
 * GET /api/notifications
 * List notifications for current user
 *
 * Query params:
 * - filter: "all" | "unread" (default: "all")
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = await getUserId(session);

    if (!userId) {
      return unauthorizedResponse();
    }

    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter") || "all";

    const whereClause: { userId: string; read?: boolean } = {
      userId,
    };

    if (filter === "unread") {
      whereClause.read = false;
    }

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({
        where: { userId },
      }),
      prisma.notification.count({
        where: { userId, read: false },
      }),
    ]);

    return successResponse(
      notifications.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
      {
        total: totalCount,
        unread: unreadCount,
        read: totalCount - unreadCount,
      }
    );
  } catch (error) {
    console.error("Notifications API error:", error);
    return errorResponse("Failed to fetch notifications");
  }
}

/**
 * POST /api/notifications
 * Perform bulk actions on notifications
 *
 * Body:
 * - action: "mark-all-read"
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = await getUserId(session);

    if (!userId) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    if (body.action === "mark-all-read") {
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });

      return successResponse({ message: "All notifications marked as read" });
    }

    return badRequestResponse("Invalid action");
  } catch (error) {
    console.error("Notifications API error:", error);
    return errorResponse("Failed to update notifications");
  }
}
