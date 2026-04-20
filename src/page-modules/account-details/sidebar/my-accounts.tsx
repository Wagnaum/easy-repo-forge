import { GetAccountsResponse } from "@/api/get-account";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDocument } from "@/utils/format";
import { ArrowRightIcon, 
  // Loader2
 } from "lucide-react";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { 
  // useState,
   Fragment } from "react";
// import { Format } from "@/components/input/format";
// import { toast } from "sonner";
// import { api, parseError } from "@/lib/api";
import { QueryObserverResult } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
// import { useAuth } from "@/hooks/auth";

interface MyAccountsSidebarProps {
  isLoading: boolean;
  data: GetAccountsResponse | undefined;
  refetch: () => Promise<QueryObserverResult<GetAccountsResponse, Error>>;
}

export function MyAccountsSidebar({
  data,
  isLoading,
  // refetch,
}: MyAccountsSidebarProps) {
  // const [open, setOpen] = useState(false);
  // const [documentNewAccount, setDocumentNewAccount] = useState("");
  // const [loading, setLoading] = useState(false);

  // const { user: userLogged } = useAuth();

  // async function handleCreateAccount() {
  //   try {
  //     if (loading) {
  //       return;
  //     }
  //     if (!documentNewAccount) {
  //       toast.error("O campo CPF é obrigatório.");
  //       return;
  //     }

  //     setLoading(true);
  //     await api.post(`/accounts/${data?.account.id}/bet`, {
  //       document: documentNewAccount.replace(/\D/g, ""),
  //     });

  //     await refetch();
  //     toast.success("Conta criada com sucesso.");
  //     setDocumentNewAccount("");
  //     setOpen(false);
  //   } catch (error) {
  //     const err = parseError(error);
  //     toast.error(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <>
      <ul className="grid gap-3">
        {isLoading && (
          <>
            <li className="flex items-center justify-between">
              <Skeleton className="h-5 w-[250px]" />
              <Skeleton className="h-5 w-[60px]" />
            </li>

            <li className="flex items-center justify-between">
              <Skeleton className="h-5 w-[250px]" />
              <Skeleton className="h-5 w-[60px]" />
            </li>
          </>
        )}
        {data?.allAccounts?.map((account) => (
          <Fragment key={account.id}>
            <li className="flex items-center justify-between" key={account.id}>
              <span className="text-muted-foreground">
                {account.name} <span>{formatDocument(account.document)}</span>
                <p className="text-xs text-muted-foreground">
                  {account.type === "BET" ? (
                    <span className="text-green-800 font-semibold">Bet</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Normal
                    </span>
                  )}
                </p>
              </span>
              <span>
                <Link to={`/accounts/${account.id}` as any}>
                  <Button variant="ghost" className="flex gap-2">
                    Acessar
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </Link>
              </span>
            </li>
            <Separator />
          </Fragment>
        ))}

        {/* {data?.main && (
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {data?.main.name}{" "}
              <span>{formatDocument(data?.main.document)}</span>
              <p className="text-xs text-muted-foreground">
                {data?.main.type === "BET" ? (
                  <span className="text-green-800 font-semibold">Bet</span>
                ) : (
                  <span className="text-yellow-600 font-semibold">Normal</span>
                )}
              </p>
            </span>
            <span>
              <Link to={`/accounts/${data?.main.id}`}>
                <Button variant="ghost" className="flex gap-2">
                  Acessar
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            </span>
          </li>
        )} */}
      </ul>

      {/* {userLogged?.id === data?.account.user.id && (
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button className="mt-2" variant={"secondary"}>
              Criar nova conta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar nova conta</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para criar uma nova conta.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="document" className="text-right">
                  CPF
                </Label>
                <Input
                  id="document"
                  value={documentNewAccount}
                  onChange={(e) =>
                    setDocumentNewAccount(Format.CPF(e.target.value))
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                disabled={loading}
                onClick={handleCreateAccount}
              >
                {loading && <Loader2 className="animate-spin mr-2" />}
                Criar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )} */}
    </>
  );
}
