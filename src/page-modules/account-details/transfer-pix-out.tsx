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

interface ValitatePixInfoResponse {
  info: {
    id: string;
    accountId: string;
    key: string;
    type: string | null;
    document: string;
    name: string;
    agency: string | null;
    accountNumber: string | null;
    accountType: string | null;
    personType: string | null;
    pspName: string;
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

  const [loadingValidateQrCode, setLoadingValidateQrCode] = useState(false);
  const [pixInfoData, setPixInfoData] =
    useState<ValitatePixInfoResponse | null>();
  const [loadingPaymentPix, setLoadingPaymentPix] = useState(false);

  const [value, setValue] = useState(0);

  const [, setQrCodePaymentData] = useState<object | null>();

  async function validateQrCode() {
    if (loadingValidateQrCode) {
      return;
    }

    try {
      setLoadingValidateQrCode(true);
      const { data: responsePixInfo } = await api.post<ValitatePixInfoResponse>(
        `/accounts/${data?.account?.id}/keys/info`,
        {
          key,
        }
      );

      setPixInfoData(responsePixInfo);
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoadingValidateQrCode(false);
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

    try {
      setLoadingPaymentPix(true);
      const { data: responsePaymentQrCode } = await api.post(
        `/accounts/${data?.account?.id}/pix/payment`,
        {
          id: pixInfoData?.info.id,
          key,
          amount: value,
        }
      );

      setQrCodePaymentData(responsePaymentQrCode);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Mensagem de aviso sobre limitação de transferências */}
      {/* <div className="col-span-2 mb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800 mb-1">
              ⚠️ Atenção!
            </h3>
            <p className="text-sm text-amber-700">
              No momento só estão disponíveis transferências para contas bancárias de mesma titularidade.
            </p>
          </div>
        </div>
      </div> */}
      
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
              />
              {!pixInfoData && (
                <Button
                  onClick={validateQrCode}
                  disabled={loadingValidateQrCode}
                >
                  {loadingValidateQrCode && (
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
                  <Label htmlFor="receipt">Conta</Label>
                  <Input
                    id="receipt"
                    value={`${
                      pixInfoData.info.accountNumber
                    } - ${formatDocument(pixInfoData.info.pspName)}`}
                    disabled
                  />
                </div>

                <div className="mt-2 mb-2">
                  <Label htmlFor="receipt">Valor</Label>
                  <IntlCurrencyInput
                    id="receipt"
                    value={value}
                    onChange={(_, rawValue) => {
                      setValue(rawValue);
                    }}
                  />
                </div>
                <Button onClick={handlePaymentPix} disabled={loadingPaymentPix}>
                  {loadingPaymentPix && (
                    <Loader2 className="animate-spin mr-2" />
                  )}
                  Pagar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
