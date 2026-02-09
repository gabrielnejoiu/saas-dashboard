import { PrismaClient, Status } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Project name templates for realistic data
const projectPrefixes = [
  "Website Redesign",
  "Mobile App",
  "API Integration",
  "Database Migration",
  "UI/UX Overhaul",
  "Security Audit",
  "Performance Optimization",
  "Feature Development",
  "Infrastructure Upgrade",
  "Analytics Dashboard",
  "E-commerce Platform",
  "CRM Implementation",
  "Payment Gateway",
  "Cloud Migration",
  "DevOps Pipeline",
];

const projectSuffixes = [
  "v1.0",
  "v2.0",
  "Phase 1",
  "Phase 2",
  "Q1",
  "Q2",
  "2026",
  "Enterprise",
  "Pro",
  "Lite",
];

// Team member names
const teamMembers = [
  "John Smith",
  "Sarah Johnson",
  "Michael Chen",
  "Emily Davis",
  "David Wilson",
  "Jessica Martinez",
  "Robert Brown",
  "Amanda Taylor",
  "Christopher Lee",
  "Stephanie Anderson",
];

function generateProjectName(): string {
  const prefix = faker.helpers.arrayElement(projectPrefixes);
  const suffix = faker.helpers.arrayElement(projectSuffixes);
  return `${prefix} - ${suffix}`;
}

function generateStatus(): Status {
  return faker.helpers.arrayElement([
    Status.ACTIVE,
    Status.ACTIVE,
    Status.ACTIVE, // Weight towards active
    Status.ON_HOLD,
    Status.COMPLETED,
    Status.COMPLETED,
  ]);
}

function generateDeadline(): Date {
  // Generate deadlines between 30 days ago and 180 days in the future
  return faker.date.between({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
  });
}

function generateBudget(): number {
  // Generate budgets between $1,000 and $500,000
  return faker.number.int({ min: 1000, max: 500000 });
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.project.deleteMany();
  console.log("🗑️  Cleared existing projects");

  // Generate 30 projects
  const projectCount = 30;
  const projects = [];

  for (let i = 0; i < projectCount; i++) {
    const project = {
      name: generateProjectName(),
      status: generateStatus(),
      deadline: generateDeadline(),
      assignedTo: faker.helpers.arrayElement(teamMembers),
      budget: generateBudget(),
    };
    projects.push(project);
  }

  // Insert all projects
  const result = await prisma.project.createMany({
    data: projects,
  });

  console.log(`✅ Created ${result.count} projects`);

  // Show sample data
  const sampleProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  console.log("\n📋 Sample projects created:");
  sampleProjects.forEach((project) => {
    console.log(`   - ${project.name} (${project.status}) - $${project.budget}`);
  });

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
