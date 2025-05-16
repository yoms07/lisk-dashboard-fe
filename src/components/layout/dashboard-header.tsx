import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
}

export function DashboardHeader({
  title,
  description,
  action,
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
    </div>
  );
}
