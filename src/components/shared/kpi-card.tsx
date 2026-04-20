import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  index?: number;
  subtitle?: string;
  trend?: { value: number; positive: boolean };
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.28, ease: "easeOut" as const },
  }),
};

export function KPICard({
  title,
  value,
  icon,
  index = 0,
  subtitle,
  trend,
  className,
}: KPICardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn("rounded-xl border bg-card p-6", className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 truncate text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend.positive ? "text-emerald-600" : "text-red-500"
              )}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% vs mês anterior
            </p>
          )}
        </div>
        {icon && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--brand-primary-light)" }}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
