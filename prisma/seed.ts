import { PrismaClient, Status, NotificationType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

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

// Notification templates
const notificationTemplates = [
  {
    title: "Project deadline approaching",
    message: "The project '{project}' is due in {days} days. Make sure to review all deliverables.",
    type: NotificationType.WARNING,
  },
  {
    title: "New team member added",
    message: "{member} has been added to the '{project}' project.",
    type: NotificationType.INFO,
  },
  {
    title: "Project completed",
    message: "Congratulations! The '{project}' project has been marked as completed.",
    type: NotificationType.SUCCESS,
  },
  {
    title: "Budget update",
    message: "The budget for '{project}' has been increased by {percent}%.",
    type: NotificationType.INFO,
  },
  {
    title: "Task assigned to you",
    message: "You have been assigned to review the {task} for the {team} team.",
    type: NotificationType.INFO,
  },
  {
    title: "Project status changed",
    message: "The project '{project}' status has been changed to {status}.",
    type: NotificationType.INFO,
  },
  {
    title: "Weekly report available",
    message: "Your weekly project summary is now available. You managed {count} projects this week.",
    type: NotificationType.INFO,
  },
  {
    title: "System maintenance scheduled",
    message: "Scheduled maintenance will occur on {day} at {time}. Expect brief downtime.",
    type: NotificationType.WARNING,
  },
  {
    title: "New milestone reached",
    message: "The '{project}' project has reached {percent}% completion!",
    type: NotificationType.SUCCESS,
  },
  {
    title: "Review requested",
    message: "{member} has requested your review on '{project}'.",
    type: NotificationType.INFO,
  },
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

function generateProgress(status: Status): number {
  switch (status) {
    case Status.COMPLETED:
      return 100;
    case Status.ON_HOLD:
      return faker.number.int({ min: 10, max: 60 });
    case Status.ACTIVE:
      return faker.number.int({ min: 20, max: 95 });
    default:
      return 0;
  }
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

function generateNotification(projectNames: string[]): {
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
} {
  const template = faker.helpers.arrayElement(notificationTemplates);
  let message = template.message;

  // Replace placeholders with realistic data
  message = message.replace("{project}", faker.helpers.arrayElement(projectNames));
  message = message.replace("{member}", faker.helpers.arrayElement(teamMembers));
  message = message.replace("{days}", String(faker.number.int({ min: 2, max: 14 })));
  message = message.replace("{percent}", String(faker.number.int({ min: 10, max: 50 })));
  message = message.replace("{task}", faker.helpers.arrayElement(["API documentation", "code review", "design mockups", "test cases", "deployment checklist"]));
  message = message.replace("{team}", faker.helpers.arrayElement(["backend", "frontend", "design", "QA", "DevOps"]));
  message = message.replace("{status}", faker.helpers.arrayElement(["Active", "On Hold", "Completed"]));
  message = message.replace("{count}", String(faker.number.int({ min: 3, max: 12 })));
  message = message.replace("{day}", faker.helpers.arrayElement(["Sunday", "Saturday", "Monday"]));
  message = message.replace("{time}", faker.helpers.arrayElement(["2:00 AM", "3:00 AM", "4:00 AM"]));

  return {
    title: template.title,
    message,
    type: template.type,
    read: faker.datatype.boolean({ probability: 0.5 }),
    createdAt: faker.date.recent({ days: 14 }),
  };
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.project.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("🗑️  Cleared existing data");

  // Create demo user with full profile
  const hashedPassword = await bcrypt.hash("demo123", 12);
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@example.com",
      password: hashedPassword,
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      role: "Project Manager",
      department: "Engineering",
      bio: "Passionate about building great products and leading teams to success. Over 5 years of experience in project management and software development.",
    },
  });
  console.log(`👤 Created demo user: ${demoUser.email} (password: demo123)`);

  // Generate 30 projects
  const projectCount = 30;
  const projects = [];
  const projectNames: string[] = [];

  for (let i = 0; i < projectCount; i++) {
    const name = generateProjectName();
    const status = generateStatus();
    projectNames.push(name);

    const project = {
      name,
      status,
      deadline: generateDeadline(),
      assignedTo: faker.helpers.arrayElement(teamMembers),
      budget: generateBudget(),
      progress: generateProgress(status),
    };
    projects.push(project);
  }

  // Insert all projects
  const projectResult = await prisma.project.createMany({
    data: projects,
  });

  console.log(`✅ Created ${projectResult.count} projects`);

  // Generate 12 notifications for the demo user
  const notificationCount = 12;
  const notifications = [];

  for (let i = 0; i < notificationCount; i++) {
    const notification = generateNotification(projectNames);
    notifications.push({
      ...notification,
      userId: demoUser.id,
    });
  }

  // Sort notifications by date (newest first) and mark some as unread
  notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  // Make the first 4 notifications unread
  for (let i = 0; i < Math.min(4, notifications.length); i++) {
    notifications[i].read = false;
  }

  const notificationResult = await prisma.notification.createMany({
    data: notifications,
  });

  console.log(`🔔 Created ${notificationResult.count} notifications`);

  // Show sample data
  const sampleProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  console.log("\n📋 Sample projects created:");
  sampleProjects.forEach((project) => {
    console.log(`   - ${project.name} (${project.status}) - ${project.progress}% - $${project.budget}`);
  });

  const sampleNotifications = await prisma.notification.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  console.log("\n🔔 Sample notifications created:");
  sampleNotifications.forEach((notification) => {
    console.log(`   - ${notification.title} (${notification.type}) - ${notification.read ? "read" : "unread"}`);
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
