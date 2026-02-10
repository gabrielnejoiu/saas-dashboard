"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { DeleteConfirmDialog } from "@/components/projects/DeleteConfirmDialog";
import { Pagination } from "@/components/ui/pagination";
import { useProjects } from "@/hooks/useProjects";
import type { Project, ProjectStatus } from "@/types/project";

export default function ProjectsPage() {
  const {
    projects,
    isLoading,
    error,
    search,
    status,
    page,
    meta,
    statusCounts,
    setSearch,
    setStatus,
    setPage,
    clearFilters,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle opening create modal
  const handleCreate = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  // Handle opening edit modal
  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Handle opening delete dialog
  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submit (create/update)
  const handleSubmit = useCallback(
    async (data: {
      name: string;
      status: ProjectStatus;
      deadline: string;
      assignedTo: string;
      budget: string;
    }) => {
      setIsSubmitting(true);

      try {
        const projectData = {
          name: data.name,
          status: data.status,
          deadline: data.deadline,
          assignedTo: data.assignedTo,
          budget: Number(data.budget),
        };

        let success: boolean;

        if (selectedProject) {
          success = await updateProject(selectedProject.id, projectData);
        } else {
          success = await createProject(projectData);
        }

        if (success) {
          setIsModalOpen(false);
          setSelectedProject(null);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedProject, createProject, updateProject]
  );

  // Handle delete confirm
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedProject) return;

    setIsSubmitting(true);

    try {
      const success = await deleteProject(selectedProject.id);

      if (success) {
        setIsDeleteDialogOpen(false);
        setSelectedProject(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedProject, deleteProject]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track all your projects in one place.
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meta.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {statusCounts.active}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Hold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {statusCounts.onHold}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {statusCounts.completed}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <ProjectFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onClear={clearFilters}
        />

        {/* Error message */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {/* Projects Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <ProjectTable
              projects={projects}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              totalItems={meta.total}
              itemsPerPage={meta.limit}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleSubmit}
        project={selectedProject}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={handleDeleteConfirm}
        project={selectedProject}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
}
