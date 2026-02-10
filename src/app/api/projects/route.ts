import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/validators";
import { Prisma, Status } from "@prisma/client";
import {
  successResponse,
  errorResponse,
  badRequestResponse,
} from "@/lib/api-utils";

/**
 * GET /api/projects
 * List all projects with optional filtering and search
 *
 * Query params:
 * - status: Filter by status (ACTIVE, ON_HOLD, COMPLETED, or ALL)
 * - search: Search by project name
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build where clause
    const where: Prisma.ProjectWhereInput = {};

    // Filter by status if provided and not "ALL"
    if (status && status !== "ALL" && Object.values(Status).includes(status as Status)) {
      where.status = status as Status;
    }

    // Search by name if provided
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Get total count for pagination
    const total = await prisma.project.count({ where });

    // Get paginated projects
    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return successResponse(projects, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return errorResponse("Failed to fetch projects");
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = createProjectSchema.safeParse(body);
    if (!validationResult.success) {
      return badRequestResponse(
        "Validation failed",
        validationResult.error.flatten().fieldErrors
      );
    }

    const { name, status, deadline, assignedTo, budget } = validationResult.data;

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        status: status as Status,
        deadline: new Date(deadline),
        assignedTo,
        budget: new Prisma.Decimal(budget),
      },
    });

    return successResponse(project, undefined, 201);
  } catch (error) {
    console.error("Error creating project:", error);
    return errorResponse("Failed to create project");
  }
}
