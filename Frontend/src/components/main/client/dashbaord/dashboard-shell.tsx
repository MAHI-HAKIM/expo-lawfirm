import type React from "react";
interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6" {...props}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">{children}</div>
    </div>
  );
}
