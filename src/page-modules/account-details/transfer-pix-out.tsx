import { GetAccountsResponse } from "@/api/get-account";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, parseError } from "@/lib/api";
import { formatDocument, numberToCurrent } from "@/utils/format";
import { toastStyle } from "@/utils/toast-style";
import { QueryObserverResult } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import IntlCurrencyInput from "@/components/react-intl-currency-input/intl-currency-input";

interface ValidatePixKeyInfoResponse {
  info: {
    id: string;
    accountId: string;
    endToEndId: string;
    key: string;
    type: string;
    document: string;
    name: string;
    agency: string;
    accountNumber: string;
    accountType: string;
    personType: string;
    pspName: string;
    institution: string;
    used: boolean;
    transactionIdentification: string | null;
    amount: number | null;
    initiationType: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface PayQrCodeAccountProps {
  data: GetAccountsResponse | undefined;
  refetch: () => Promise<QueryObserverResult<GetAccountsResponse, Error>>;
}

export function TransferPixOutSidebar({
  data,
  refetch,
}: PayQrCodeAccountProps) {
  const [key, setKey] = useState<string>("");

  const [loadingValidateKey, setLoadingValidateKey] = useState(false);
  const [pixInfoData, setPixInfoData] =
    useState<ValidatePixKeyInfoResponse | null>();
  const [loadingPaymentPix, setLoadingPaymentPix] = useState(false);

  const [value, setValue] = useState(0);

  async function validateKey() {
    if (loadingValidateKey) {
      return;
    }

    if (!key.trim()) {
      toast.error("Informe a chave Pix.", toastStyle.error);
      return;
    }

    try {
      setLoadingValidateKey(true);
      const { data: responsePixInfo } =
        await api.post<ValidatePixKeyInfoResponse>(
          `/accounts/${data?.account?.id}/keys/info`,
          { key: key.trim() }
        );

      setPixInfoData(responsePixInfo);
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoadingValidateKey(false);
    }
  }

  async function handlePaymentPix() {
    if (loadingPaymentPix) {
      return;
    }
    if (value <= 0) {
      toast.error("O valor deve ser maior que zero.", toastStyle.error);
      return;
    }
    if (!pixInfoData?.info?.id) {
      toast.error("Consulte a chave Pix novamente.", toastStyle.error);
      return;
    }

    try {
      setLoadingPaymentPix(true);
      await api.post(`/accounts/${data?.account?.id}/pix/payment`, {
        id: pixInfoData.info.id,
        amount: value,
      });

      toast.success("Pagamento realizado com sucesso!", {
        ...toastStyle.success,
        duration: 5000,
      });
      await refetch();
      setValue(0);
      setPixInfoData(null);
      setKey("");
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoadingPaymentPix(false);
    }
  }

  function handleResetKey() {
    setPixInfoData(null);
    setValue(0);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="col-span-2 rounded-md">
        <CardHeader>
          <CardTitle>Realizar Pix</CardTitle>
          <CardDescription>
            <div className="mb-2">
              Informe a chave Pix para realizar o pagamento.
            </div>
            <div className="mt-2">
              Valor disponível: {numberToCurrent(data?.account?.balance)}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3 w-full">
              <Label htmlFor="code">Chave Pix</Label>
              <Input
                id="code"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={!!pixInfoData}
              />
              {!pixInfoData && (
                <Button
                  onClick={validateKey}
                  disabled={loadingValidateKey}
                >
                  {loadingValidateKey && (
                    <Loader2 className="animate-spin mr-2" />
                  )}
                  Continuar
                </Button>
              )}
            </div>
          </div>

          {pixInfoData && (
            <div className="grid gap-6 mt-6">
              <div className="grid gap-3 w-full">
                <Label htmlFor="receipt">Dados do recebedor</Label>
                <Input
                  id="receipt"
                  value={`${pixInfoData.info.name} - ${formatDocument(
                    pixInfoData.info.document
                  )}`}
                  disabled
                />

                <div className="mt-2">
                  <Label htmlFor="bank">Banco</Label>
                  <Input
                    id="bank"
                    value={`${pixInfoData.info.pspName}${
                      pixInfoData.info.institution
                        ? ` (${pixInfoData.info.institution})`
                        : ""
                    }`}
                    disabled
                  />
                </div>

                <div className="mt-2">
                  <Label htmlFor="amount">Valor</Label>
                  <IntlCurrencyInput
                    id="amount"
                    value={value}
                    onChange={(_, rawValue) => {
                      setValue(rawValue);
                    }}
                  />
                </div>

                <div className="mt-2 mb-2">
                  <Label htmlFor="pin">PIN transacional</Label>
                  <Input
                    id="pin"
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={6}
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="••••"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleResetKey}
                    disabled={loadingPaymentPix}
                  >
                    Trocar chave
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handlePaymentPix}
                    disabled={loadingPaymentPix}
                  >
                    {loadingPaymentPix && (
                      <Loader2 className="animate-spin mr-2" />
                    )}
                    Pagar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
