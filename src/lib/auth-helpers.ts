import { prisma } from "./prisma";

/**
 * Session type for auth helpers
 */
export interface SessionUser {
  user?: {
    id?: string;
    email?: string | null;
  };
}

/**
 * Get user ID from session, falling back to email lookup if ID is not available
 * This handles cases where the session token doesn't include the user ID
 *
 * @param session - The NextAuth session object
 * @returns The user ID or null if not found
 */
export async function getUserId(session: SessionUser | null): Promise<string | null> {
  if (!session?.user) return null;

  // Try session.user.id first (most common case)
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

/**
 * Verify that a user owns a specific resource
 *
 * @param userId - The user ID to check ownership for
 * @param resourceUserId - The user ID associated with the resource
 * @returns True if the user owns the resource
 */
export function verifyOwnership(userId: string, resourceUserId: string): boolean {
  return userId === resourceUserId;
}
