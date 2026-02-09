import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/validators";
import { Prisma, Status } from "@prisma/client";

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

    return NextResponse.json({
      success: true,
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
      },
      { status: 500 }
    );
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
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
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

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
      },
      { status: 500 }
    );
  }
}
