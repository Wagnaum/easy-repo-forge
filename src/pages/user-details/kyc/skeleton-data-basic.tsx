import { DataTableRow } from "@/components/data-table/row";
import { DataTable } from "@/components/data-table/table";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonDataBasicProps {
  title?: string;
  rows?: number;
}

export function SkeletonDataBasic({ title, rows = 4 }: SkeletonDataBasicProps) {
  return (
    <DataTable title={title}>
      {[...Array(rows)].map((item) => (
        <DataTableRow key={item} name="loading">
          <Skeleton className="w-1/2 h-8" />
        </DataTableRow>
      ))}
    </DataTable>
  );
}