import { GetAccountsResponse } from "@/api/get-account";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatDocument, numberToCurrent } from "@/utils/format";
import { QueryObserverResult } from "@tanstack/react-query";
import IntlCurrencyInput from "@/components/react-intl-currency-input/intl-currency-input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { api, parseError } from "@/lib/api";
import toast from "react-hot-toast";
import { toastStyle } from "@/utils/toast-style";

interface AccountDetailsPageProps {
  data: GetAccountsResponse | undefined;
  refetch: () => Promise<QueryObserverResult<GetAccountsResponse, Error>>;
}

export function RechargeAccountSidebar({
  data,
  refetch,
}: AccountDetailsPageProps) {
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRecharge() {
    try {
      if (isLoading) {
        return;
      }
      if (amount <= 0) {
        toast.error("O valor deve ser maior que zero.", toastStyle.error);
        return;
      }
      setIsLoading(true);

      await api.post(`/accounts/${data?.account?.id}/recharge`, {
        amount,
      });
      await refetch();
      toast.success("Transferência realizada com sucesso.", toastStyle.success);
      setAmount(0);
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Transferência entre contas</CardTitle>
          <CardDescription>
            <div>
              <span className="font-bold">Conta Origem</span>
              <ul>
                <li>
                  {data?.main?.name} - {formatDocument(data?.main?.document)}
                </li>
              </ul>
            </div>

            <div className="mt-2">
              <span className="font-bold">Conta Destino</span>
              <ul>
                <li>
                  {data?.account?.name} -{" "}
                  {formatDocument(data?.account?.document)}
                </li>
              </ul>
            </div>
            <div className="mt-2">
              Valor disponível: {numberToCurrent(data?.main?.balance)}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3 w-[200px]">
              <Label htmlFor="amount">Valor</Label>
              <IntlCurrencyInput
                id="amount"
                value={amount}
                onChange={(_, rawValue) => {
                  setAmount(rawValue);
                }}
              />
              <Button
                type="button"
                onClick={handleRecharge}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                Transferir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
