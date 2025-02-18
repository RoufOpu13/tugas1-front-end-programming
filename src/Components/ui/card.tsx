import { cn } from "../lib/utils";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-white rounded-2xl shadow-md p-6", className)}>{children}</div>;
}
