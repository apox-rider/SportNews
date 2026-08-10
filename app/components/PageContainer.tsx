import type { ReactNode } from "react";

export default function PageContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-4 py-10 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}
