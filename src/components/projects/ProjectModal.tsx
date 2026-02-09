"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { Project } from "@/types/project";

// Form validation schema
const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters"),
  status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED"]),
  deadline: z.string().min(1, "Deadline is required"),
  assignedTo: z
    .string()
    .min(1, "Team member name is required")
    .max(100, "Team member name must be less than 100 characters"),
  budget: z
    .string()
    .min(1, "Budget is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Budget must be a positive number",
    }),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  project?: Project | null;
  isLoading?: boolean;
}

export function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  project,
  isLoading = false,
}: ProjectModalProps) {
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      status: "ACTIVE",
      deadline: "",
      assignedTo: "",
      budget: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (project) {
      const deadlineDate = new Date(project.deadline);
      const formattedDeadline = deadlineDate.toISOString().split("T")[0];

      reset({
        name: project.name,
        status: project.status,
        deadline: formattedDeadline,
        assignedTo: project.assignedTo,
        budget: String(project.budget),
      });
    } else {
      reset({
        name: "",
        status: "ACTIVE",
        deadline: "",
        assignedTo: "",
        budget: "",
      });
    }
  }, [project, reset]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    await onSubmit(data);
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const currentStatus = watch("status");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to your project here."
              : "Add a new project to your dashboard."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="Enter project name"
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={currentStatus}
              onValueChange={(val) => setValue("status", val as "ACTIVE" | "ON_HOLD" | "COMPLETED")}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              {...register("deadline")}
              disabled={isLoading}
            />
            {errors.deadline && (
              <p className="text-sm text-destructive">
                {errors.deadline.message}
              </p>
            )}
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              placeholder="Enter team member name"
              {...register("assignedTo")}
              disabled={isLoading}
            />
            {errors.assignedTo && (
              <p className="text-sm text-destructive">
                {errors.assignedTo.message}
              </p>
            )}
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter budget amount"
              {...register("budget")}
              disabled={isLoading}
            />
            {errors.budget && (
              <p className="text-sm text-destructive">{errors.budget.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Spinner size="sm" className="mr-2" />}
              {isEditing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
