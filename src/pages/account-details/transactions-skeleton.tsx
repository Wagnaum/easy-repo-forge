import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function TransactionsSkeleton() {
  return Array.from({ length: 10 }).map((_, i) => {
    return (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-6" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6" />
        </TableCell>        
      </TableRow>
    );
  });
}
