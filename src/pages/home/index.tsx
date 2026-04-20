import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

import { CalendarIcon, CreditCard, DollarSign, Users } from "lucide-react";

import { ChartAccount } from "./chart-account";
import { Skeleton } from "@/components/ui/skeleton";
import { TotalAccounts } from "./total-account";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { endOfDay, format, startOfDay, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import {
  getAccountStatistics,
  GetAccountStatisticsResponse,
  getWithdrawStatistics,
  GetWithdrawStatisticsResponse,
} from "@/api/get-statistics";
// import { ChartRevenue } from "./chart-revenue";
import { useAuth } from "@/hooks/auth";
import { Enable2fa } from "./enable2fa";
import { Helmet } from "react-helmet-async";
import { useCustomer } from "@/hooks/customer";
import { api } from "@/lib/api";
import { useIsOwem } from "@/hooks/is-owem";

export function HomePage() {
  const { user } = useAuth();
  const { customer } = useCustomer();
  const isOwem = useIsOwem();

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  });

  const [openDatePickerGraph, setOpenDatePickerGraph] = useState(false);
  const [dateGraph, setDateGraph] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  });

  const { data: withdraw, isLoading: isLoadingWithdraw } =
    useQuery<GetWithdrawStatisticsResponse>({
      enabled: date?.to && date.from ? true : false,
      queryKey: ["widhdraw:statistics:backoffice", date],
      queryFn: () =>
        getWithdrawStatistics({
          startAt: date?.from,
          endAt: date?.to,
        }),
      // refetchInterval: 1000 * 60, // 1 minute
    });

  const { data: accounts, isLoading: isLoadingAccounts } =
    useQuery<GetAccountStatisticsResponse>({
      queryKey: ["accounts:statistics:backoffice", dateGraph],
      enabled: dateGraph?.to && dateGraph.from ? true : false,
      queryFn: () =>
        getAccountStatistics({
          startAt: dateGraph?.from,
          endAt: dateGraph?.to,
        }),
      // refetchInterval: 1000 * 60, // 1 minute
    });

  // const { data: revenue } = useQuery<GetWithdrawStatisticsResponse>({
  //   queryKey: ["widhdraw:statistics:revenue:backoffice", dateGraph],
  //   enabled: dateGraph?.to && dateGraph.from ? true : false,
  //   queryFn: () =>
  //     getWithdrawStatistics({
  //       startAt: dateGraph?.from,
  //       endAt: dateGraph?.to,
  //     }),
  //   // refetchInterval: 1000 * 60, // 1 minute
  // });

  if (!user) {
    return null;
  }

  if (!user.isTwoFactorEnabled) {
    return <Enable2fa />;
  }

  async function handleDownloadSplitReport() {
    const response = await api.get("/statistics", {
      params: {
        startAt: date?.from,
        endAt: date?.to,
        type: "xlsx",
      },
      responseType: "blob", // essencial para lidar com arquivos binários
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "relatorio.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }


  console.log('isOwem', isOwem);

  return (
    <>
      <Helmet title={`Painel | ${customer.name}`} />
      <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
        <div className="flex">
          <div className="flex flex-1">
            <h1>Dashboard</h1>
          </div>
          <div className="flex justify-end">
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y", {
                        locale: ptBR,
                      })}{" "}
                      -{" "}
                      {format(date.to, "LLL dd, y", {
                        locale: ptBR,
                      })}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y", {
                      locale: ptBR,
                    })
                  )
                ) : (
                  <span>Selecione a data</span>
                )}
              </Button>
            </PopoverTrigger>
            <Button className="ml-2">Aplicar</Button>
          </div>
        </div>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            locale={ptBR}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {user.role === "SUPER_ADMIN" && (
        <div className="flex flex-1">
          {/* alinhar a direita o botão */}
          <div className="flex-1 flex justify-end">
            <Button onClick={handleDownloadSplitReport}>
              Download relatório de split
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingWithdraw ? (
                <Skeleton className="w-32 h-8" />
              ) : (
                <>{withdraw?.withdraw?.totalGeneralAmount || 0}</>
              )}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas Pagas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingWithdraw ? (
                <Skeleton className="w-32 h-8" />
              ) : (
                <>{withdraw?.withdraw?.totalNormalAmount || 0}</>
              )}
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contas Não Pagas
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingWithdraw ? (
                <Skeleton className="w-32 h-8" />
              ) : (
                <>{withdraw?.withdraw?.totalFreeAmount || 0}</>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Popover
          open={openDatePickerGraph}
          onOpenChange={setOpenDatePickerGraph}
        >
          <div className="flex justify-end">
            <div className="flex justify-end">
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateGraph?.from ? (
                    dateGraph.to ? (
                      <>
                        {format(dateGraph.from, "LLL dd, y", {
                          locale: ptBR,
                        })}{" "}
                        -{" "}
                        {format(dateGraph.to, "LLL dd, y", {
                          locale: ptBR,
                        })}
                      </>
                    ) : (
                      format(dateGraph.from, "LLL dd, y", {
                        locale: ptBR,
                      })
                    )
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <Button className="ml-2">Aplicar</Button>
            </div>
          </div>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateGraph?.from}
              selected={dateGraph}
              onSelect={setDateGraph}
              locale={ptBR}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-6">
        <div className="xl:col-span-4">
          {!isLoadingWithdraw && (
            <ChartAccount
              statistics={accounts}
              startAt={dateGraph?.from}
              endAt={dateGraph?.to}
            />
          )}
        </div>

        {!isLoadingAccounts && (
          <TotalAccounts
            total={accounts?.accounts?.numberOfAccounts}
            startAt={dateGraph?.from}
            endAt={dateGraph?.to}
          />
        )}
      </div>

      {/* <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-6">
        <div className="xl:col-span-6">
          {!isLoadingWithdraw && (
            <ChartRevenue
              statistics={revenue}
              startAt={dateGraph?.from}
              endAt={dateGraph?.to}
            />
          )}
        </div>
      </div> */}
    </>
  );
}
