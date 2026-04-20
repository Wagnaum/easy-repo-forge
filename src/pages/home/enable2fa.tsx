import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import { api, parseError } from "@/lib/api";
import { toastStyle } from "@/utils/toast-style";
import { Loader2 } from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function Enable2fa() {
  const { refreshUser } = useAuth();
  const [open, setOpen] = useState(true);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");

  useEffect(() => {
    api
      .post("/users/create-two-factor", { code: "" })
      .then(({ data }) => {
        setQrCode(data.qrCode);
      })
      .catch((error) => {
        const err = parseError(error);
        toast.error(err.message, toastStyle.error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleNext() {
    if (step === 1) {
      setStep(2);
    } else {
      if (!code) {
        toast.error("Digite o código de verificação", toastStyle.error);
        return;
      }

      api
        .post("/users/create-two-factor", { code })
        .then(async () => {
          toast.success(
            "Autenticação de dois fatores ativada",
            toastStyle.success
          );
          await refreshUser();
          setOpen(false);
        })
        .catch((error) => {
          const err = parseError(error);
          toast.error(err.message, toastStyle.error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            É necessário ativar a autenticação de dois fatores
          </AlertDialogTitle>
          <AlertDialogDescription>
            {step === 1 &&
              "Escaneie o QR Code abaixo com o seu app de autenticação"}
            {step === 2 &&
              "Digite o código de verificação gerado pelo app de autenticação"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {step === 1 && (
          <div className="flex justify-center items-center">
            {qrCode && <img src={qrCode} className="max-w-80 h-auto" />}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-2">
            <div className="flex items-center mb-2">
              <Label htmlFor="token">Duplo fator de autenticação</Label>
            </div>
            <span className="flex mb-2 text-sm">
              Informe o código de verificação gerado pelo app de autenticação
            </span>
            <Input
              id="token"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        )}
        <Button type="button" onClick={handleNext}>
          {loading && <Loader2 className="animate-spin mr-2" />}
          {step === 1 ? "Próximo" : "Ativar"}
        </Button>

        {step === 2 && (
          <Button
            variant="link"
            type="button"
            onClick={() => {
              setStep(1);
              setCode("");
            }}
          >
            Voltar par o QrCode
          </Button>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
