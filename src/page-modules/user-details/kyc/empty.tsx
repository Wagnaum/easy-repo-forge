interface KycEmptyProps {
  title: string;
  description: string;
}

export function KycEmpty({ title, description }: KycEmptyProps) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center p-8">
        <h3 className="text-xl font-medium tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {description}
        </p>
      </div>
    </div>
  );
}