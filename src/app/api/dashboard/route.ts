import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-utils";

/**
 * GET /api/dashboard
 * Get dashboard statistics and chart data
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Get project statistics
    const [
      totalProjects,
      activeProjects,
      onHoldProjects,
      completedProjects,
      totalBudgetResult,
      recentProjects,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: "ACTIVE" } }),
      prisma.project.count({ where: { status: "ON_HOLD" } }),
      prisma.project.count({ where: { status: "COMPLETED" } }),
      prisma.project.aggregate({
        _sum: { budget: true },
      }),
      prisma.project.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          name: true,
          status: true,
          progress: true,
          deadline: true,
        },
      }),
    ]);

    // Get projects by month using regular Prisma query
    const allProjects = await prisma.project.findMany({
      select: { createdAt: true },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Count projects by month
    const monthCounts: Record<string, number> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    allProjects.forEach((project) => {
      const monthName = monthNames[project.createdAt.getMonth()];
      monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
    });

    // Get unique team members count
    const teamMembersResult = await prisma.project.findMany({
      select: { assignedTo: true },
      distinct: ["assignedTo"],
    });

    // Calculate budget utilized (projects that are active or completed)
    const utilizedBudgetResult = await prisma.project.aggregate({
      where: {
        status: { in: ["ACTIVE", "COMPLETED"] },
      },
      _sum: { budget: true },
    });

    const totalBudget = Number(totalBudgetResult._sum.budget || 0);
    const utilizedBudget = Number(utilizedBudgetResult._sum.budget || 0);
    const budgetUtilization = totalBudget > 0 ? Math.round((utilizedBudget / totalBudget) * 100) : 0;

    // Format monthly data for charts
    const currentMonth = new Date().getMonth();

    // Create last 12 months array
    const monthlyData = monthNames.map((name) => ({
      name,
      projects: monthCounts[name] || 0,
    }));

    // Reorder to show last 12 months ending with current month
    const reorderedMonthlyData = [
      ...monthlyData.slice(currentMonth + 1),
      ...monthlyData.slice(0, currentMonth + 1),
    ];

    // Status distribution for pie chart
    const statusData = [
      { name: "Active", value: activeProjects, color: "#22c55e" },
      { name: "On Hold", value: onHoldProjects, color: "#eab308" },
      { name: "Completed", value: completedProjects, color: "#6366f1" },
    ];

    // Simulated weekly activity (in real app, you'd track actual task completions)
    const weeklyActivity = [
      { day: "Mon", tasks: Math.floor(Math.random() * 15) + 5 },
      { day: "Tue", tasks: Math.floor(Math.random() * 15) + 5 },
      { day: "Wed", tasks: Math.floor(Math.random() * 15) + 5 },
      { day: "Thu", tasks: Math.floor(Math.random() * 15) + 5 },
      { day: "Fri", tasks: Math.floor(Math.random() * 15) + 5 },
      { day: "Sat", tasks: Math.floor(Math.random() * 10) + 2 },
      { day: "Sun", tasks: Math.floor(Math.random() * 8) + 1 },
    ];

    return successResponse({
      stats: {
        totalProjects,
        activeProjects,
        onHoldProjects,
        completedProjects,
        totalBudget,
        budgetUtilization,
        teamMembers: teamMembersResult.length,
      },
      recentProjects: recentProjects.map((p) => ({
        ...p,
        deadline: p.deadline.toISOString(),
      })),
      charts: {
        monthlyData: reorderedMonthlyData,
        statusData,
        weeklyActivity,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return errorResponse("Failed to fetch dashboard data");
  }
}
