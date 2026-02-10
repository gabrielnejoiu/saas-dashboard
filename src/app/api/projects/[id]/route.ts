import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateProjectSchema } from "@/lib/validators";
import { Prisma, Status } from "@prisma/client";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  badRequestResponse,
} from "@/lib/api-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/:id
 * Get a single project by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return notFoundResponse("Project");
    }

    return successResponse(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return errorResponse("Failed to fetch project");
  }
}

/**
 * PUT /api/projects/:id
 * Update an existing project
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return notFoundResponse("Project");
    }

    // Validate input
    const validationResult = updateProjectSchema.safeParse(body);
    if (!validationResult.success) {
      return badRequestResponse(
        "Validation failed",
        validationResult.error.flatten().fieldErrors
      );
    }

    const { name, status, deadline, assignedTo, budget } = validationResult.data;

    // Build update data
    const updateData: Prisma.ProjectUpdateInput = {};
    if (name !== undefined) updateData.name = name;
    if (status !== undefined) updateData.status = status as Status;
    if (deadline !== undefined) updateData.deadline = new Date(deadline);
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (budget !== undefined) updateData.budget = new Prisma.Decimal(budget);

    // Update project
    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return successResponse(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return errorResponse("Failed to update project");
  }
}

/**
 * DELETE /api/projects/:id
 * Delete a project
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return notFoundResponse("Project");
    }

    // Delete project
    await prisma.project.delete({
      where: { id },
    });

    return successResponse({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return errorResponse("Failed to delete project");
  }
}
