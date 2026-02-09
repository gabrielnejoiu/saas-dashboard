"use client";

import { useState, useEffect, useCallback } from "react";
import type { Project, ProjectStatus, ApiResponse } from "@/types/project";

interface UseProjectsOptions {
  initialStatus?: ProjectStatus | "ALL";
  initialSearch?: string;
}

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  search: string;
  status: ProjectStatus | "ALL";
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  setSearch: (search: string) => void;
  setStatus: (status: ProjectStatus | "ALL") => void;
  clearFilters: () => void;
  createProject: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => Promise<boolean>;
  updateProject: (id: string, data: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
  const { initialStatus = "ALL", initialSearch = "" } = options;

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<ProjectStatus | "ALL">(initialStatus);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (status !== "ALL") params.append("status", status);
      if (search) params.append("search", search);
      params.append("limit", "100"); // Get all for now

      const response = await fetch(`/api/projects?${params.toString()}`);
      const data: ApiResponse<Project[]> = await response.json();

      if (data.success && data.data) {
        setProjects(data.data);
        if (data.meta) {
          setMeta({
            total: data.meta.total || 0,
            page: data.meta.page || 1,
            limit: data.meta.limit || 10,
            totalPages: data.meta.totalPages || 0,
          });
        }
      } else {
        setError(data.error || "Failed to fetch projects");
      }
    } catch (err) {
      setError("Failed to fetch projects");
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (
    data: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          budget: Number(data.budget),
        }),
      });

      const result: ApiResponse<Project> = await response.json();

      if (result.success) {
        await fetchProjects();
        return true;
      } else {
        setError(result.error || "Failed to create project");
        return false;
      }
    } catch (err) {
      setError("Failed to create project");
      console.error("Error creating project:", err);
      return false;
    }
  };

  const updateProject = async (
    id: string,
    data: Partial<Project>
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          budget: data.budget !== undefined ? Number(data.budget) : undefined,
        }),
      });

      const result: ApiResponse<Project> = await response.json();

      if (result.success) {
        await fetchProjects();
        return true;
      } else {
        setError(result.error || "Failed to update project");
        return false;
      }
    } catch (err) {
      setError("Failed to update project");
      console.error("Error updating project:", err);
      return false;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const result: ApiResponse<{ message: string }> = await response.json();

      if (result.success) {
        await fetchProjects();
        return true;
      } else {
        setError(result.error || "Failed to delete project");
        return false;
      }
    } catch (err) {
      setError("Failed to delete project");
      console.error("Error deleting project:", err);
      return false;
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
  };

  return {
    projects,
    isLoading,
    error,
    search,
    status,
    meta,
    setSearch,
    setStatus,
    clearFilters,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
}
