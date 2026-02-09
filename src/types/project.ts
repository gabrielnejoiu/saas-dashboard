/**
 * Project status enum matching the Prisma schema
 */
export type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED";

/**
 * Project interface representing the data model
 */
export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  deadline: Date;
  assignedTo: string;
  budget: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating a new project
 */
export interface CreateProjectDTO {
  name: string;
  status: ProjectStatus;
  deadline: string; // ISO date string from form
  assignedTo: string;
  budget: number;
}

/**
 * DTO for updating an existing project
 */
export interface UpdateProjectDTO {
  name?: string;
  status?: ProjectStatus;
  deadline?: string;
  assignedTo?: string;
  budget?: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

/**
 * Query parameters for listing projects
 */
export interface ProjectQueryParams {
  status?: ProjectStatus | "ALL";
  search?: string;
  page?: number;
  limit?: number;
}
