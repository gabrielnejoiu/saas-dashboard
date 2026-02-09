import { Badge } from "@/components/ui/badge";
import { ProjectStatus } from "@/types/project";

interface StatusBadgeProps {
  status: ProjectStatus;
}

const statusConfig: Record<ProjectStatus, { label: string; variant: "default" | "success" | "warning" | "secondary" }> = {
  ACTIVE: {
    label: "Active",
    variant: "success",
  },
  ON_HOLD: {
    label: "On Hold",
    variant: "warning",
  },
  COMPLETED: {
    label: "Completed",
    variant: "secondary",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
