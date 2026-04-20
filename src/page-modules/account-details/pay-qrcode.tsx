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

interface ValidateQrCodeResponse {
  qrCode: {
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
    transactionIdentification: string;
    amount: number;
    initiationType: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface PayQrCodeAccountProps {
  isLoading: boolean;
  data: GetAccountsResponse | undefined;
  refetch: () => Promise<QueryObserverResult<GetAccountsResponse, Error>>;
}

export function PayQrCodeAccount({ data, refetch }: PayQrCodeAccountProps) {
  const [qrCode, setQrCode] = useState<string>("");

  const [loadingValidateQrCode, setLoadingValidateQrCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<ValidateQrCodeResponse | null>();
  const [loadingPaymentQrCode, setLoadingPaymentQrCode] = useState(false);

  const [value, setValue] = useState(0);

  const [, setQrCodePaymentData] = useState<object | null>();

  async function validateQrCode() {
    if (loadingValidateQrCode) {
      return;
    }

    try {
      setLoadingValidateQrCode(true);
      const { data: responseQrCode } = await api.post<ValidateQrCodeResponse>(
        `/accounts/${data?.account?.id}/read-qrcode`,
        {
          qrCode,
        }
      );

      setQrCodeData(responseQrCode);
      setValue(responseQrCode.qrCode.amount);
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoadingValidateQrCode(false);
    }
  }

  async function paymentQrCode() {
    if (loadingPaymentQrCode) {
      return;
    }
    if (value <= 0) {
      toast.error("O valor deve ser maior que zero.", toastStyle.error);
      return;
    }

    try {
      setLoadingPaymentQrCode(true);

      const { data: responsePaymentQrCode } = await api.post(
        `/accounts/${data?.account?.id}/pix/payment`,
        {
          id: qrCodeData?.qrCode?.id,
          key: qrCodeData?.qrCode?.key,
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
      setQrCodeData(null);
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoadingPaymentQrCode(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="col-span-2 rounded-md">
        <CardHeader>
          <CardTitle>Pagamento QrCode</CardTitle>
          <CardDescription>
            <div className="mt-2">
              Valor disponível: {numberToCurrent(data?.main?.balance)}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3 w-full">
              <Label htmlFor="code">Copia e Cola</Label>
              <Input
                id="code"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
              />
              {!qrCodeData && (
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

          {qrCodeData && (
            <div className="grid gap-6 mt-6">
              <div className="grid gap-3 w-full">
                <Label htmlFor="receipt">Dados do recebedor</Label>
                <Input
                  id="receipt"
                  value={`${qrCodeData.qrCode.name} - ${formatDocument(
                    qrCodeData.qrCode.document
                  )}`}
                  disabled
                />

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
                <Button onClick={paymentQrCode} disabled={loadingPaymentQrCode}>
                  {loadingPaymentQrCode && (
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
