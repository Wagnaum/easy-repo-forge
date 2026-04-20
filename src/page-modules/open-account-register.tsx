import { Format } from "@/components/input/format";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomer } from "@/hooks/customer";
import { api, parseError } from "@/lib/api";
import { toastStyle } from "@/utils/toast-style";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "@/lib/use-navigate";
import { useSearchParams } from "@/lib/use-search-params";
import { z } from "zod";

export function OpenAccountRegisterPage() {
  const [searchParams] = useSearchParams();
  const trackName = z.string().parse(searchParams.get("trackName") ?? "");

  const userId = z.string().parse(searchParams.get("user") ?? "");
  console.log(userId, trackName);

  const navigate = useNavigate();

  const { customer } = useCustomer();

  const [document, setDocument] = useState("");
  const [name, setName] = useState("");

  const [isLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  async function handleSubmitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!document) {
      toast.error("O CPF é obrigatório", toastStyle.error);
      return;
    }

    if (name.split(" ").length < 2) {
      toast.error("O nome completo é obrigatório", toastStyle.error);
      return;
    }

    try {
      setLoadingForm(true);
      const { data } = await api.post(`/accounts/account-open-bet`, {
        document: document.replace(/\D/g, ""),
        name,
        trackName,
        userId,
      });


      setLoadingForm(false);
      navigate(`/auth/account/register?inviteId=${data.account.id}`);
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoadingForm(false);
    }
  }

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col items-center p-3 sm:p-6 lg:p-8 bg-white">
        <img
          className="mx-auto h-36 w-auto"
          src={customer.logo.dark}
          alt="Hero Bank"
        />

        <Card className="mx-auto max-w-md lg:w-full">
          <CardHeader>
            <CardTitle className="text-xl">Complete seu cadastro</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitForm}>
              <div className="grid gap-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    {isLoading ? (
                      <>
                        <Skeleton className="w-full h-[20px] rounded-sm" />
                        <Skeleton className="w-full h-[30px] rounded-sm" />
                      </>
                    ) : (
                      <>
                        <Label htmlFor="last-name">CPF</Label>
                        <Input
                          id="last-name"
                          value={Format.CPF(document)}
                          onChange={(e) => setDocument(e.target.value)}
                        />
                      </>
                    )}
                  </div>

                  <div className="grid gap-2">
                    {isLoading ? (
                      <>
                        <Skeleton className="w-full h-[20px] rounded-sm" />
                        <Skeleton className="w-full h-[30px] rounded-sm" />
                      </>
                    ) : (
                      <>
                        <Label htmlFor="first-name">
                          Nome completo (Igual do documento)
                        </Label>
                        <Input
                          id="first-name"
                          required
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="grid gap-4">
                  {/* <div className="grid gap-2">
                      {isLoading ? (
                        <>
                          <Skeleton className="w-full h-[20px] rounded-sm" />
                          <Skeleton className="w-full h-[30px] rounded-sm" />
                        </>
                      ) : (
                        <>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            onChange={(e) =>
                              setEmail(e.target.value)
                            }
                            value={email}
                          />
                        </>
                      )}
                    </div> */}
                  {/* <div className="grid gap-2">
                      {isLoading ? (
                        <>
                          <Skeleton className="w-full h-[20px] rounded-sm" />
                          <Skeleton className="w-full h-[30px] rounded-sm" />
                        </>
                      ) : (
                        <>
                          <Label htmlFor="phone">Celular</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) =>
                              setPhone(Format.Phone(e.target.value))
                            }
                          />
                        </>
                      )}
                    </div> */}
                </div>
                {/* <div className="grid gap-2">
                    {isLoading ? (
                      <>
                        <Skeleton className="w-full h-[20px] rounded-sm" />
                        <Skeleton className="w-full h-[30px] rounded-sm" />
                      </>
                    ) : (
                      <>
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </>
                    )}
                  </div>
                  <div className="grid gap-2">
                    {isLoading ? (
                      <>
                        <Skeleton className="w-full h-[20px] rounded-sm" />
                        <Skeleton className="w-full h-[30px] rounded-sm" />
                      </>
                    ) : (
                      <>
                        <Label htmlFor="repeatPassword">Repetir senha</Label>
                        <Input
                          id="repeatPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </>
                    )}
                  </div> */}
                <Button type="submit" className="w-full" disabled={loadingForm}>
                  {loadingForm ? (
                    <span>
                      <Loader2 className="animate-spin" />
                    </span>
                  ) : (
                    "Continuar"
                  )}
                </Button>
              </div>
            </form>
            {/* <div className="mt-4 text-center text-sm">
                Já tem um cadastro?{" "}
                <Link to="/" className="underline">
                  Fazer login
                </Link>
              </div> */}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
