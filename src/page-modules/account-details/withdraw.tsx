import { GetAccountsResponse } from "@/api/get-account";
import { getAccountKeys } from "@/api/get-keys";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api, parseError } from "@/lib/api";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
// import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IntlCurrencyInput from "@/components/react-intl-currency-input/intl-currency-input";
import { getWithdrawRequests } from "@/api/get-withdraw-requests";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { numberToCurrent } from "@/utils/format";
import { formatDate } from "date-fns";
import { toastStyle } from "@/utils/toast-style";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { FormatZeroRateStatus } from "@/utils/format-role";

interface WithdrawAccountSidebarProps {
  data: GetAccountsResponse;
  refetch: () => Promise<QueryObserverResult<GetAccountsResponse, Error>>;
}

export function WithdrawAccountSidebar({ data }: WithdrawAccountSidebarProps) {
  const [isLoadingActivateKey, setIsLoadingActivateKey] = useState(false);

  const [saqueValue, setSaqueValue] = useState(0);
  const [saqueType, setSaqueType] = useState("normal");
  const [saqueJustification, setSaqueJustification] = useState("");
  const [isLoadingSaque, setIsLoadingSaque] = useState(false);

  const [plataforma, setPlataforma] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const { data: keys, refetch: refetchKeys } = useQuery({
    queryKey: ["accounts-details:keys", data?.account.id],
    queryFn: () => getAccountKeys({ accountId: data?.account.id }),
    staleTime: 1000 * 30, // 30 seconds
  });

  const {
    data: withdraws,
    refetch: refetchWithdraws,
    // isLoading: isLoadingWithdraws,
  } = useQuery({
    queryKey: ["accounts-details:widhdrawrequests", data?.account.id],
    queryFn: () => getWithdrawRequests({ accountId: data?.account.id }),
    refetchInterval: 1000 * 60, // 1 minute
  });

  const hasKeyCPF = keys?.data.some((key) => key.type === "CPF");

  console.log(withdraws?.withdrawRequest);

  async function handleActivateKey() {
    try {
      setIsLoadingActivateKey(true);
      await api.post(`/accounts/${data.account.id}/keys`, {
        type: "CPF/CNPJ",
      });
      await refetchKeys();
      toast.success("Chave CPF ativada com sucesso", toastStyle.success);
    } catch (error) {
      const err = parseError(error);
      toast.error(err.message, toastStyle.error);
    } finally {
      setIsLoadingActivateKey(false);
    }
  }

  function handleSaqueType(value: string) {
    setSaqueType(value);
  }

  async function handleSaque() {
    if (isLoadingSaque) {
      return;
    }

    if (saqueType === "free") {
      if (!plataforma) {
        toast.error("Informe a Casa de Aposta.", toastStyle.error);
        return;
      }

      if (!login) {
        toast.error("Informe o login.", toastStyle.error);
        return;
      }

      if (!password) {
        toast.error("Informe a senha.", toastStyle.error);
        return;
      }
    }

    try {
      setIsLoadingSaque(true);
      await api.post(`/accounts/${data.account.id}/withdraw-request`, {
        amount: saqueValue,
        type: saqueType === "free" ? "FREE" : "NORMAL",
        justification: saqueJustification,
        plataform: plataforma,
        login,
        password,
      });
      setSaqueJustification("");
      setSaqueValue(0);
      setPlataforma("");
      setLogin("");
      setPassword("");
      setSaqueType("normal");
      await refetchWithdraws();
      toast.success("Saque registrado com sucesso.", toastStyle.success);
    } catch (error) {
      const err = parseError(error);
      toast.error(err.message, toastStyle.error);
    } finally {
      setIsLoadingSaque(false);
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-end">
        {hasKeyCPF ? (
          <Button variant="default">Chave CPF Ativa</Button>
        ) : (
          <Button variant="outline" onClick={handleActivateKey}>
            {isLoadingActivateKey && <Loader2 className="animate-spin mr-2" />}
            Ativar chave CPF
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-2 rounded-md">
          <CardHeader>
            <CardTitle>Registrar Saque</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3 w-full grid-cols-2">
                <div>
                  <Label htmlFor="value">Valor</Label>
                  <IntlCurrencyInput
                    id="value"
                    value={saqueValue}
                    onChange={(_, rawValue) => {
                      setSaqueValue(rawValue);
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="value">Tipo</Label>
                  <Select onValueChange={handleSaqueType} value={saqueType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Normal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="free">Taxa Zero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {saqueType === "free" && (
                <>
                  <div className="grid gap-3 w-full">
                    <Label htmlFor="plataforma">Casa de Aposta</Label>
                    <Input
                      type="text"
                      id="plataforma"
                      placeholder="Nome da Casa de Aposta"
                      value={plataforma}
                      onChange={(e) => setPlataforma(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3 w-full grid-cols-2">
                    <div>
                      <Label htmlFor="login">Login</Label>
                      <Input
                        id="login"
                        value={login}
                        onChange={(e) => {
                          setLogin(e.target.value);
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  {/* <div className="grid gap-3 w-full">
                    <Label htmlFor="justification">Informações</Label>
                    <Textarea
                      id="justification"
                      rows={5}
                      value={saqueJustification}
                      onChange={(e) => setSaqueJustification(e.target.value)}
                    />
                  </div> */}
                </>
              )}

              <div className="grid gap-3 w-full">
                <Button onClick={handleSaque} disabled={isLoadingSaque}>
                  {isLoadingSaque && <Loader2 className="animate-spin mr-2" />}
                  Concluir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Últimas solicitações</CardTitle>
            <CardContent className="p-0">
              {withdraws?.withdrawRequest &&
              withdraws?.withdrawRequest?.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Valor Recebido</TableHead>
                        <TableHead className="">Tipo</TableHead>
                        <TableHead className="">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdraws.withdrawRequest.map((withdraw) => (
                        <TableRow key={withdraw.id}>
                          <TableCell className="">
                            <div className="font-medium">
                              {formatDate(
                                new Date(withdraw.createdAt),
                                "dd/MM/yyyy HH:mm"
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            {numberToCurrent(withdraw.amount)}
                          </TableCell>
                          <TableCell>
                            {numberToCurrent(withdraw?.receivedAmount ?? 0)}
                          </TableCell>
                          <TableCell>
                            {withdraw.type === "NORMAL"
                              ? "Normal"
                              : "Taxa Zero"}
                          </TableCell>
                          <TableCell>
                            <Badge className="text-xs" variant={"secondary"}>
                              {FormatZeroRateStatus(withdraw.status)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhuma solicitação de saque encontrada
                </div>
              )}
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
