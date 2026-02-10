import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper function to get user ID from session
async function getUserId(session: { user?: { id?: string; email?: string | null } } | null) {
  if (!session?.user) return null;

  // Try session.user.id first
  if (session.user.id) return session.user.id;

  // Fall back to looking up by email
  if (session.user.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    return user?.id || null;
  }

  return null;
}

// GET - List notifications for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = await getUserId(session);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter") || "all"; // all, unread

    const whereClause: { userId: string; read?: boolean } = {
      userId: userId,
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
        where: { userId: userId },
      }),
      prisma.notification.count({
        where: { userId: userId, read: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: notifications.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
      meta: {
        total: totalCount,
        unread: unreadCount,
        read: totalCount - unreadCount,
      },
    });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST - Mark all notifications as read
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = await getUserId(session);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body.action === "mark-all-read") {
      await prisma.notification.updateMany({
        where: { userId: userId, read: false },
        data: { read: true },
      });

      return NextResponse.json({
        success: true,
        message: "All notifications marked as read",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
