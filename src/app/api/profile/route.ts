import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getUserId } from "@/lib/auth-helpers";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  handleValidationError,
} from "@/lib/api-utils";

const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  department: z.string().max(100).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
});

/**
 * GET /api/profile
 * Get current user profile with stats
 */
export async function GET() {
  try {
    const session = await auth();
    const userId = await getUserId(session);

    if (!userId) {
      return unauthorizedResponse();
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        location: true,
        role: true,
        department: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      return notFoundResponse("User");
    }

    // Get user's project stats
    const [projectsManaged, completedProjects, activeProjects, onHoldProjects] =
      await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { status: "COMPLETED" } }),
        prisma.project.count({ where: { status: "ACTIVE" } }),
        prisma.project.count({ where: { status: "ON_HOLD" } }),
      ]);

    return successResponse({
      ...user,
      createdAt: user.createdAt.toISOString(),
      stats: {
        projectsManaged,
        completed: completedProjects,
        inProgress: activeProjects,
        onHold: onHoldProjects,
      },
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return errorResponse("Failed to fetch profile");
  }
}

/**
 * PUT /api/profile
 * Update current user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    const userId = await getUserId(session);

    if (!userId) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    const validationResult = profileUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validationResult.data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        location: true,
        role: true,
        department: true,
        bio: true,
        createdAt: true,
      },
    });

    return successResponse({
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }

    console.error("Profile PUT error:", error);
    return errorResponse("Failed to update profile");
  }
}
