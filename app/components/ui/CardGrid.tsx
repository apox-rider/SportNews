import type { ReactNode } from "react";

export default function CardGrid({
  children,
  cols = 4,
  className = "",
}: {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const gridCols = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[cols];

  return (
    <div className={`grid grid-cols-1 gap-4 ${gridCols} ${className}`}>
      {children}
    </div>
  );
}
