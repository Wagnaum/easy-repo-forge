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
import { GetAccountKeysSidebar } from "./sidebar/get-keys";
import { MyAccountsSidebar } from "./sidebar/my-accounts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Key, Loader2, QrCode, Send, UserRound } from "lucide-react";
import { PayQrCodeAccount } from "./pay-qrcode";
import { TransactionsAccount } from "./transactions";
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
import { CopyButton } from "@/components/shared/copy-button";
import { motion } from "framer-motion";
import { LottieLoader } from "@/components/shared/lottie-loader";

export function AccountDetailsPage() {
  const { id = "" } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["accounts-details", id],
    queryFn: () => getAccount({ id }),
    refetchInterval: 1000 * 60,
    retry: 1,
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

  const canChangePlayer =
    user?.id === "7facf86b-d736-43bf-b83c-f1751ba5a963" ||
    user?.id === "2c938eb1-e33a-4f84-ab53-741c06930f1b" ||
    user?.id === "43a54499-27d1-4085-9ce4-9589f5ec050d" ||
    user?.id === "77fbc650-26c9-45cd-b218-c15d18054261" ||
    user?.id === "6f74cd7c-9268-4d8a-9a73-9cb2f3c104b5" ||
    user?.id === "e797d29d-2468-4d98-8982-d74d926120ee" ||
    user?.id === "eefd8bb8-926b-40b2-a127-4b2a3599d357";

  const balance =
    data?.account?.id === "1fff7d44-7a88-4e9a-aca4-2340c86cae6f"
      ? (data?.account?.balance ?? 0) / 2
      : data?.account?.balance ?? 0;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <h2 className="text-lg font-semibold">Não foi possível carregar a conta</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {(error as Error)?.message || "Ocorreu um erro inesperado ao buscar os dados desta conta."}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para contas
          </Button>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para contas
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 lg:col-span-1"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  {isLoading ? (
                    <Skeleton className="h-6 w-40" />
                  ) : (
                    <h2 className="text-lg font-bold truncate">
                      {data?.account?.name}
                    </h2>
                  )}
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      data?.account?.type === "BET"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    }`}
                  >
                    {data?.account?.type === "BET" ? "Bet" : "Normal"}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CPF</span>
                  {isLoading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    <span className="flex items-center gap-1 font-mono text-xs">
                      {formatDocument(data?.account?.document)}
                      <CopyButton
                        text={(data?.account?.document ?? "").replace(/\D/g, "")}
                      />
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Conta</span>
                  {isLoading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    <span className="flex items-center gap-1 font-mono text-xs">
                      {data?.account?.number}
                      <CopyButton text={String(data?.account?.number ?? "")} />
                    </span>
                  )}
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground">
                    Saldo disponível
                  </p>
                  {isLoading ? (
                    <Skeleton className="mt-1 h-8 w-32" />
                  ) : (
                    <p
                      className="text-2xl font-bold tracking-tight"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {numberToCurrent(balance)}
                    </p>
                  )}
                </div>

                {canChangePlayer && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => setChangePlayerModal(true)}
                  >
                    <UserRound className="h-4 w-4" />
                    Trocar Jogador
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Minhas chaves Pix</CardTitle>
            </CardHeader>
            <CardContent>
              <GetAccountKeysSidebar accountId={id} account={data?.account} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Minhas últimas contas</CardTitle>
            </CardHeader>
            <CardContent>
              <MyAccountsSidebar
                data={data}
                isLoading={isLoading}
                refetch={refetch}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Main */}
        <div className="lg:col-span-2">
          <Card>
            <Tabs defaultValue="account">
              <CardHeader>
                <CardDescription>
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="account" className="gap-1">
                      <Key className="h-3.5 w-3.5" />
                      Transações
                    </TabsTrigger>
                    <TabsTrigger value="transfer" className="gap-1">
                      <Send className="h-3.5 w-3.5" />
                      Transferir
                    </TabsTrigger>
                    <TabsTrigger value="deposit" className="gap-1">
                      <QrCode className="h-3.5 w-3.5" />
                      Pagar QrCode
                    </TabsTrigger>
                  </TabsList>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TabsContent value="account">
                  {data ? (
                    <TransactionsAccount accountId={data.account.id} />
                  ) : (
                    <LottieLoader inline size={110} label="Carregando transações..." />
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
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>

      <AlertDialog open={changePlayerModal} onOpenChange={setChangePlayerModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trocar conta de jogador</AlertDialogTitle>
            <AlertDialogDescription>
              Para realizar essa ação, informe o CPF do novo jogador (Para onde a
              conta será transferida).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2 mb-2">
            <Label htmlFor="last-name">CPF</Label>
            <Input
              id="last-name"
              value={Format.CPF(document)}
              onChange={(e) => setDocument(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              onClick={handleChangePlayer}
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
