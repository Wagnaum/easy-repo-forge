interface DataTableRowProps {
  name: string;
  children: React.ReactNode;
}

export function DataTableRow({ name, children }: DataTableRowProps) {
  return (
    <>
      <div className="even:bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
        <dt className="text-muted-foreground font-bold text-sm">
          {name}
        </dt>
        <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
          {children}
        </dd>
      </div>
    </>
  );
}