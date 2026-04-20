import { getAccountKeys } from "@/api/get-keys";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Copy, Loader2, Trash } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api, parseError } from "@/lib/api";
import { toastStyle } from "@/utils/toast-style";
import toast from "react-hot-toast";
import { formatDocument } from "@/utils/format";
import { useAuth } from "@/hooks/auth";
import { GetAccountResponse } from "@/api/get-account";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GetAccountKeysSidebarProps {
  accountId: string;
  account: GetAccountResponse | undefined;
}

export function GetAccountKeysSidebar({
  accountId,
  account,
}: GetAccountKeysSidebarProps) {
  const [keyType, setKeyType] = useState<string | null>(null);
  const [loadingNewKey, setLoadingNewKey] = useState(false);

  const [loadingDeleteKey, setLoadingDeleteKey] = useState(false);

  const { user: userLogged } = useAuth();
  const [open, setOpen] = useState(false);
  const [keyId, setKeyId] = useState<string | null>(null);

  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["accounts-details:keys", accountId],
    queryFn: () => getAccountKeys({ accountId }),
    staleTime: 1000 * 30, // 30 seconds
  });

  function handleNewKeyValue(value: string) {
    setKeyType(value);
  }

  async function handleNewKey() {
    if (!keyType) {
      return;
    }

    try {
      setLoadingNewKey(true);
      await api.post(`/accounts/${accountId}/keys`, {
        type: keyType,
      });
      await refetch();
      toast.success("Chave criada com sucesso.");
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoadingNewKey(false);
    }
  }

  async function handleDeleteKey(keyId: string) {
    try {
      if (!keyId) {
        return;
      }

      if (loadingDeleteKey) {
        return;
      }

      setLoadingDeleteKey(true);
      await api.delete(`/accounts/${accountId}/keys/${keyId}`);
      await refetch();
      toast.success("Chave removida com sucesso.", toastStyle.success);
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoadingDeleteKey(false);
    }
  }

  async function handleClick() {
    await handleDeleteKey(keyId!);
    setOpen(false);
    setKeyId(null);
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <dl className="grid gap-3">
          {isLoading && (
            <>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground flex flex-col">
                  <Skeleton className="h-5 w-[250px] mb-1" />
                  <Skeleton className="h-5 w-[60px]" />
                </dt>
                <dd>
                  <Skeleton className="h-4 w-4" />
                </dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground flex flex-col">
                  <Skeleton className="h-5 w-[250px] mb-1" />
                  <Skeleton className="h-5 w-full" />
                </dt>
                <dd>
                  <Skeleton className="h-4 w-4" />
                </dd>
              </div>
            </>
          )}

          {!isLoading && isSuccess && data?.data?.length > 0 ? (
            data?.data.map((key) => (
              <div key={key.id}>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground flex flex-col">
                    <span>
                      {key.type === "CPF" ? formatDocument(key.key) : key.key}
                    </span>
                    <span>{key.type}</span>
                  </dt>
                  <dd>
                    <CopyToClipboard
                      text={key.key}
                      onCopy={() => {
                        toast.success(
                          "chave copiada com sucesso!",
                          toastStyle.success
                        );
                      }}
                    >
                      <Copy className="w-4 h-4 cursor-pointer" />
                    </CopyToClipboard>
                  </dd>

                  <dd>
                    <Button
                      variant="link"
                      onClick={() => {
                        setKeyId(key.key);
                        setOpen(true);
                      }}
                    >
                      <Trash className="w-4 h-4 cursor-pointer" />
                    </Button>
                  </dd>
                </div>
              </div>
            ))
          ) : (
            <>
              <span>Nenhuma chave cadastrada.</span>
            </>
          )}
        </dl>

        {userLogged?.id === account?.user?.id && (
          <>
            <Separator className="my-2" />
            <div className="font-semibold">Nova chave Pix</div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <Select onValueChange={handleNewKeyValue}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="CELULAR">Celular</SelectItem> */}
                    <SelectItem value="EVP">Aleatória</SelectItem>
                    <SelectItem value="CPF/CNPJ">CPF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {keyType && (
                <Button className="w-1/2" onClick={handleNewKey}>
                  {loadingNewKey && <Loader2 className="animate-spin mr-2" />}
                  Criar
                </Button>
              )}
            </div>
          </>
        )}

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar essa chave Pix?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button onClick={handleClick} variant={"destructive"}>
              {loadingDeleteKey && <Loader2 className="animate-spin mr-2" />}
              Deletar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
