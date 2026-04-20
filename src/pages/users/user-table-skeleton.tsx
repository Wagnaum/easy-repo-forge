import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function UserTableSkeleton() {
  return Array.from({ length: 10 }).map((_, i) => {
    return (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-6 w-[130px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[200px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[140px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[140px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[200px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[90px]" />
        </TableCell>
      </TableRow>
    );
  });
}
