import { getAccount } from "@/api/get-account";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDocument, numberToCurrent } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useNavigate } from "@/lib/use-navigate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { GetAccountKeysSidebar } from "./sidebar/get-keys";
import { MyAccountsSidebar } from "./sidebar/my-accounts";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, UserRound } from "lucide-react";
import { PayQrCodeAccount } from "./pay-qrcode";
import { TransactionsAccount } from "./transactions";
// import { WithdrawAccountSidebar } from "./withdraw";
// import { RechargeAccountSidebar } from "./recharge";
import { TransferPixOutSidebar } from "./transfer-pix-out";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Format } from "@/components/input/format";
import { toastStyle } from "@/utils/toast-style";
import { toast } from "sonner";
import { api, parseError } from "@/lib/api";
import { useAuth } from "@/hooks/auth";

export function AccountDetailsPage() {
  const { id = "" } = useParams({ strict: false }) as { id: string  };
  const navigate = useNavigate();

  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["accounts-details", id],
    queryFn: () => getAccount({ id }),
    refetchInterval: 1000 * 60, // 1 minute
  });

  function handleBack() {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/accounts");
    }
  }

  const [changePlayerModal, setChangePlayerModal] = useState(false);

  const [loadingChangePlayer, setLoadingChangePlayer] = useState(false);
  const [document, setDocument] = useState("");

  function handleChangePlayerModal() {
    setChangePlayerModal(true);
  }

  async function handleChangePlayer() {
    if (!document) {
      toast.error("CPF é obrigatório", toastStyle.error);
      return;
    }

    try {
      setLoadingChangePlayer(true);
      await api.put(`/accounts/${id}/change-owner`, {
        document: document.replace(/\D/g, ""),
      });

      toast.success("Conta de jogador trocada com sucesso", toastStyle.success);
      setChangePlayerModal(false);
      setDocument("");
      refetch();
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoadingChangePlayer(false);
    }
  }

  return (
    <>
      <AlertDialog open={changePlayerModal} onOpenChange={setChangePlayerModal}>
        <div className="pl-4 text-lg font-semibold flex gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleBack}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <span>Voltar</span>
        </div>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="gap-4 md:gap-8 lg:col-span-1">
            <Card className="overflow-hidden rounded-sm">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    {isLoading ? (
                      <Skeleton className="h-7 w-[250px]" />
                    ) : (
                      <span className="">
                        {data?.account?.name}{" "}
                        <span className="text-xs text-muted-foreground font-normal">
                          {data?.account?.type === "BET" ? (
                            <span className="text-green-800">Bet</span>
                          ) : (
                            <span className="text-yellow-600">Normal</span>
                          )}
                        </span>
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="grid gap-1">
                    <span className="text-xs">
                      {isLoading ? (
                        <Skeleton className="h-4 w-[50px]" />
                      ) : (
                        formatDocument(data?.account?.document)
                      )}
                    </span>
                    <div className="flex">
                      Conta:{" "}
                      {isLoading ? (
                        <Skeleton className="ml-1 h-5  w-1/2" />
                      ) : (
                        data?.account?.number
                      )}
                    </div>
                    <div className="flex">
                      Saldo:{" "}
                      {isLoading ? (
                        <Skeleton className="ml-1 h-5  w-1/2" />
                      ) : (
                        <>
                          {data?.account?.id ===
                          "1fff7d44-7a88-4e9a-aca4-2340c86cae6f" ? (
                            <>{numberToCurrent(data?.account?.balance / 2)}</>
                          ) : (
                            <>{numberToCurrent(data?.account?.balance)}</>
                          )}
                        </>
                      )}
                    </div>

                    {(user?.id === "7facf86b-d736-43bf-b83c-f1751ba5a963" ||
                      user?.id === "2c938eb1-e33a-4f84-ab53-741c06930f1b" ||
                      user?.id === "43a54499-27d1-4085-9ce4-9589f5ec050d" ||
                      user?.id === "77fbc650-26c9-45cd-b218-c15d18054261" ||
                      user?.id === "6f74cd7c-9268-4d8a-9a73-9cb2f3c104b5" ||
                      user?.id === "e797d29d-2468-4d98-8982-d74d926120ee" ||
                      user?.id === "eefd8bb8-926b-40b2-a127-4b2a3599d357") && (
                      <div className="flex">
                        <Button
                          variant="destructive"
                          className="mt-2"
                          onClick={handleChangePlayerModal}
                        >
                          <UserRound className="h-4 w-4" />
                          Trocar Jogador
                        </Button>
                      </div>
                    )}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Minhas chaves Pix</div>
                  <GetAccountKeysSidebar
                    accountId={id}
                    account={data?.account}
                  />
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Minhas últimas contas</div>
                  <MyAccountsSidebar
                    data={data}
                    isLoading={isLoading}
                    refetch={refetch}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:col-span-2">
            <Card className="overflow-hidden rounded-sm">
              <Tabs defaultValue="account">
                <CardHeader className="flex flex-row items-start">
                  <CardDescription>
                    <TabsList>
                      <TabsTrigger value="account">Transações</TabsTrigger>

                      {/* {!isLoading && data?.account?.id === data?.main?.id && ( */}
                      <TabsTrigger value="transfer">Transferir</TabsTrigger>
                      {/* )} */}

                      {/* {!isLoading && data?.account?.id === data?.main?.id && ( */}
                      <TabsTrigger value="deposit">Pagar QrCode</TabsTrigger>
                      {/* )} */}

                      {/* {!isLoading && data?.account?.id !== data?.main?.id && (
                      <TabsTrigger value="deposit">Depositar</TabsTrigger>
                    )} */}

                      {/* {!isLoading && data?.account?.id !== data?.main?.id && (
                      <TabsTrigger value="withdraw">Sacar</TabsTrigger>
                    )} */}
                    </TabsList>
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Separator className="my-2" />
                  <TabsContent value="account">
                    {data ? (
                      <TransactionsAccount accountId={data.account.id} />
                    ) : (
                      <>
                        <Skeleton className="h-4 mb-4" />
                        <Skeleton className="h-4 mb-4" />
                        <Skeleton className="h-4 mb-4" />
                        <Skeleton className="h-4 mb-4" />
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="transfer">
                    <TransferPixOutSidebar data={data} refetch={refetch} />
                  </TabsContent>

                  <TabsContent value="deposit">
                    <PayQrCodeAccount
                      data={data}
                      isLoading={isLoading}
                      refetch={refetch}
                    />
                  </TabsContent>
                  {/* <TabsContent value="withdraw">
                  {data && data?.account?.id !== data?.main?.id && (
                    <WithdrawAccountSidebar data={data} refetch={refetch} />
                  )}
                </TabsContent> */}
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </main>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trocar conta de jogador</AlertDialogTitle>
            <AlertDialogDescription>
              <span>
                Para realizar essa ação, informe o CPF do novo jogador (Para
                onde a conta será transferida).
              </span>

              <div className="mt-4 mb-4">
                <Label htmlFor="last-name">CPF</Label>
                <Input
                  id="last-name"
                  value={Format.CPF(document)}
                  onChange={(e) => setDocument(e.target.value)}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              onClick={handleChangePlayer}
              variant={"default"}
              disabled={loadingChangePlayer}
            >
              {loadingChangePlayer && <Loader2 className="animate-spin mr-2" />}
              Trocar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
