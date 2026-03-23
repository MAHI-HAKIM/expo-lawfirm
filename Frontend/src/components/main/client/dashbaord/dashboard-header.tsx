interface DashboardHeaderProps {
  heading: string;
  text?: string;
  className?: string;
}

export function DashboardHeader({
  heading,
  text,
  className,
  ...props
}: DashboardHeaderProps) {
  return (
    <div className={` ${className}`} {...props}>
      <h1
        className="text-xl font-bold tracking-tight"
        style={{
          color: "#F0D078",
          fontFamily: "sans-serif",
        }}
      >
        {heading}
      </h1>
      {text && (
        <p
          className="text-sm text-muted-foreground"
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontFamily: "sans-serif",
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
}
