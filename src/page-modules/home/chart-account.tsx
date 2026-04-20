import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GetAccountStatisticsResponse } from "@/api/get-statistics";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const chartConfig = {
  accounts: {
    label: "Contas",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

interface ChartAccountProps {
  statistics: GetAccountStatisticsResponse | undefined;
  startAt: Date | undefined;
  endAt: Date | undefined;
}

export function ChartAccount({
  statistics,
  startAt,
  endAt,
}: ChartAccountProps) {
  const [chartData, setChartData] = useState([{ month: "", accounts: 0 }]);

  useEffect(() => {
    if (statistics?.accounts?.statistics) {
      const values = statistics?.accounts?.statistics.map((item) => {
        return {
          month: item.date,
          accounts: item.numberOfAccounts,
        };
      });

      setChartData([...values]);
    }
  }, [statistics?.accounts?.statistics]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cadastro de contas</CardTitle>
        <CardDescription>
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
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="accounts" fill="var(--color-accounts)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
