import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth-helpers";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/notifications/:id
 * Mark notification as read/unread
 *
 * Body:
 * - read: boolean (optional, default: true)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const userId = await getUserId(session);

    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Verify ownership
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      return notFoundResponse("Notification");
    }

    const body = await request.json();

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: body.read ?? true },
    });

    return successResponse({
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Notification PATCH error:", error);
    return errorResponse("Failed to update notification");
  }
}

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const userId = await getUserId(session);

    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Verify ownership
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      return notFoundResponse("Notification");
    }

    await prisma.notification.delete({
      where: { id },
    });

    return successResponse({ message: "Notification deleted" });
  } catch (error) {
    console.error("Notification DELETE error:", error);
    return errorResponse("Failed to delete notification");
  }
}
