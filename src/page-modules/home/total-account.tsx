import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const chartConfig = {
  visitors: {
    label: "contas",
  },
  chrome: {
    label: "Contas",
    color: "var(--brand-primary)",
  },
  safari: {
    label: "Restante",
    color: "var(--brand-accent)",
  },
} satisfies ChartConfig;

interface TotalAccountsProps {
  total: number | undefined;
  startAt: Date | undefined;
  endAt: Date | undefined;
}

export function TotalAccounts({
  total = 0,
  startAt,
  endAt,
}: TotalAccountsProps) {
  const [chartData, setChartData] = useState([
    { browser: "chrome", visitors: total, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 0, fill: "var(--color-safari)" },
  ]);

  useEffect(() => {
    setChartData([
      { browser: "chrome", visitors: total, fill: "var(--color-chrome)" },
      { browser: "safari", visitors: 0, fill: "var(--color-safari)" },
    ]);
  }, [total]);

  return (
    <Card className="flex flex-col w-full xl:col-span-2 rounded-xl border bg-card">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold">Total de contas</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0 lg:mt-10">
        <ChartContainer config={chartConfig} className="mx-auto max-h-[400px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {total?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Contas
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total de contas no periodo de
        </div>
        <div className="leading-none text-muted-foreground">
          {startAt && endAt && (
            <>
              {format(startAt, "dd/MM/yyyy", {
                locale: ptBR,
              })}{" "}
              -{" "}
              {format(endAt, "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
