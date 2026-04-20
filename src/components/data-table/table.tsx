import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "../ui/skeleton";

interface DataTableProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  rows?: number;
}

export function DataTable({ title, description, isLoading = false, rows = 4, children }: DataTableProps) {
  return (
    <>
      <Card className="mb-8 rounded-sm">
        {title && (
          <CardHeader>
            <CardTitle
              className="scroll-m-20 pb-0 text-xl font-semibold tracking-tight ">
              <span className="inline pb-2 border-[#142249] border-0 border-opacity-60">{title}</span>
            </CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </CardHeader>
        )}
        <CardContent>
          <dl className="divide-y divide-gray-100">
            {isLoading ? (
              <>
                {Array.from({ length: rows }).map((_, index) => (
                  <div key={index} className="even:bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                    <dt className="text-muted-foreground font-bold text-sm">
                      <Skeleton className="w-1/2 h-8" />
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                      <Skeleton className="w-1/2 h-8" />
                    </dd>
                  </div>
                ))}
              </>
            ) : children}
          </dl>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!children && <p className="text-muted-foreground text-sm leading-6">
            Não há dados disponíveis.  
          </p>}
        </CardFooter>
      </Card>
    </>
  );
}