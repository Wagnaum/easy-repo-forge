import {
  getAccountByInviteId,
  GetAccountByInviteIdResponse,
} from "@/api/get-user-by-invite-id";
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
import { useAuth } from "@/hooks/auth";
import { useCustomer } from "@/hooks/customer";
import { useIsOwem } from "@/hooks/is-owem";
import { api, parseError } from "@/lib/api";
import { toastStyle } from "@/utils/toast-style";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { OwemDocumentUpload } from "./account-register/owem-document-upload";

export function AccountRegisterPage() {
  const [searchParams] = useSearchParams();
  const inviteId = z.string().parse(searchParams.get("inviteId") ?? "");

  const { logout } = useAuth();
  const navigate = useNavigate();

  const { customer } = useCustomer();

  // const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  // const [documentNumber, setDocumentNumber] = useState("");
  // const [documentUF, setDocumentUF] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [documentExpedido, setDocumentExpedido] = useState("");
  // const [documentDataExpedicao, setDocumentDataExpedicao] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [motherName, setMotherName] = useState("");

  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const isOwem = useIsOwem();

  const numberInputRef = useRef<HTMLInputElement | null>(null);

  const [link, setLink] = useState("");

  const {
    data: result,
    isLoading,
    isError,
    refetch,
  } = useQuery<GetAccountByInviteIdResponse>({
    queryKey: ["accounts:create:invite", inviteId],
    queryFn: () =>
      getAccountByInviteId({
        inviteId,
      }),
    staleTime: 1000 * 60, // 1 minute
  });

  useEffect(() => {
    if (zipCode?.length === 9) {
      const zipCodeFormatted = zipCode.replace("-", "");
      axios
        .get(`https://viacep.com.br/ws/${zipCodeFormatted}/json/`)
        .then(({ data }) => {
          if (data?.logradouro) {
            setStreet(data?.logradouro);
            setNeighborhood(data?.bairro);
            setCity(data?.localidade);
            setState(data?.uf);

            if (numberInputRef.current) {
              numberInputRef.current.focus();
            }
          } else {
            setStreet("");
            setNeighborhood("");
            setCity("");
            setState("");
          }
        })
        .catch(() => {
          setStreet("");
          setNeighborhood("");
          setCity("");
          setState("");
        });
    }
    //    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipCode]);

  useEffect(() => {
    console.log("change->", result);
    if (result?.account?.status === "WAITING_DOCUMENT") {
      const fetchLinkWithRetries = async (retries = 100) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            const response = await api.get(`/accounts/${inviteId}/kyc`);
            console.log("response", response.data?.url);
            const link = response.data?.url;

            if (link) {
              setLink(link);
              break; // se obteve o link, sai do loop
            }
          } catch (err) {
            console.error(`Erro ao buscar link (tentativa ${attempt}):`, err);
          }

          // espera um pouco antes da próxima tentativa
          await new Promise((res) => setTimeout(res, 3000));
        }
      };

      fetchLinkWithRetries();
    }
  }, [result?.account?.status, inviteId]);

  useEffect(() => {
    if (result?.account.name) {
      setName(result?.account.name);
      console.log("changed name");
    }
  }, [result?.account.id]);

  if (isError) {
    return (
      <div className="flex min-h-screen flex-1 flex-col justify-center items-center p-3 sm:p-6 lg:p-8 bg-white">
        <Card className="mx-auto max-w-md lg:w-full">
          <CardHeader>
            <CardTitle className="text-xl">Erro ao carregar</CardTitle>
            <CardDescription>
              Ocorreu um erro ao carregar as informações do convite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Código do convite</Label>
                <Input id="first-name" value={inviteId} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Convite inválido</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function handleSubmitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // if (!password) {
    //   toast.error("A senha é obrigatória", toastStyle.error);
    //   return;
    // }

    // if (password !== confirmPassword) {
    //   toast.error("As senhas não conferem", toastStyle.error);
    //   return;
    // }

    if (name.split(" ").length < 2) {
      toast.error("O nome completo é obrigatório", toastStyle.error);
      return;
    }

    try {
      setLoadingForm(true);
      await api.post(`/accounts/invite/${inviteId}`, {
        name: name,
        password: "@password",
        // phone: phone.replace(/\D/g, ""),
      });
      await refetch();
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoadingForm(false);
    }
  }

  async function handleSubmitFormIndividual(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!phone) {
      toast.error("O celular é obrigatório", toastStyle.error);
      return;
    }

    if (!email) {
      toast.error("O e-mail é obrigatório", toastStyle.error);
      return;
    }

    // if (!documentNumber) {
    //   toast.error("O número do documento é obrigatório", toastStyle.error);
    //   return;
    // }

    // if (!documentUF) {
    //   toast.error("O UF do documento é obrigatório", toastStyle.error);
    //   return;
    // }
    // if (!documentExpedido) {
    //   toast.error("O local de expedição é obrigatório", toastStyle.error);
    //   return;
    // }
    // if (!documentDataExpedicao) {
    //   toast.error("A data de expedição é obrigatória", toastStyle.error);
    //   return;
    // }

    if (!motherName) {
      toast.error("O nome da mãe é obrigatório", toastStyle.error);
      return;
    }

    if (motherName.split(" ").length < 2) {
      toast.error("O nome da mãe completo é obrigatório", toastStyle.error);
      return;
    }

    if (!birthDate) {
      toast.error("A data de nascimento é obrigatória", toastStyle.error);
      return;
    }

    try {
      setLoadingForm(true);
      const birthDateFormatted = birthDate.split("/");
      // const documentDateIssueFormatted = documentDataExpedicao.split("/");
      const birthDatePrepated = new Date(
        `${birthDateFormatted[2]}-${birthDateFormatted[1]}-${birthDateFormatted[0]}`
      );
      // const documentDateIssueFormattedPrepated = new Date(
      //   `${documentDateIssueFormatted[2]}-${documentDateIssueFormatted[1]}-${documentDateIssueFormatted[0]}`
      // );

      await api.post(`/accounts/invite/${inviteId}`, {
        individual: {
          email,
          phone: `+55${phone.replace(/\D/g, "")}`,
          documentNumber: "00000000", //documentNumber,
          documentUf: "MG", //documentUF,
          documentIssuing: "DETRAN", // documentExpedido,
          documentDateIssue: new Date(), // documentDateIssueFormattedPrepated,
          motherName,
          birthDate: birthDatePrepated,
          income: 0,
          publiclyExposedPerson: false,
        },
      });
      await refetch();
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoadingForm(false);
    }
  }

  async function handleSubmitFormAddress(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!zipCode) {
      toast.error("O CEP é obrigatório", toastStyle.error);
      return;
    }
    if (!street) {
      toast.error("O Endereço é obrigatório", toastStyle.error);
      return;
    }
    if (!number) {
      toast.error("O Número é obrigatório", toastStyle.error);
      return;
    }
    if (!city) {
      toast.error("A cidade é obrigatória", toastStyle.error);
      return;
    }
    if (!neighborhood) {
      toast.error("O bairro é obrigatório", toastStyle.error);
      return;
    }
    if (!state) {
      toast.error("O estado é obrigatória", toastStyle.error);
      return;
    }

    try {
      setLoadingForm(true);
      await api.post(`/accounts/invite/${inviteId}`, {
        address: {
          zipCode,
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
        },
      });
      await refetch();
    } catch (err) {
      await refetch();
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoadingForm(false);
    }
  }

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // async function handleSubmitFormDocumentsSelfie(event: any) {
  //   event.preventDefault();

  //   const fileType = event.target?.files[0]?.type;
  //   if (
  //     fileType !== "image/png" &&
  //     fileType !== "image/jpeg" &&
  //     fileType !== "image/jpg" &&
  //     fileType !== "application/pdf"
  //   ) {
  //     toast.error(
  //       "Só é permitido arquivos do tipo PDF, PNG, JPG ou JPEG.",
  //       toastStyle.error
  //     );
  //     return;
  //   }

  //   // validar tamanho do arquivo no máximo 5mb
  //   if (event.target?.files[0]?.size > 5 * 1024 * 1024) {
  //     toast.error("O arquivo deve ter no máximo 5mb.", toastStyle.error);
  //     return;
  //   }

  //   try {
  //     setLoadingForm(true);
  //     const formData = new FormData();
  //     formData.append("file", event.target?.files[0]);
  //     await api.post(
  //       `/users/invite/${inviteId}/documents?type=SELFIE`,
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );
  //     await refetch();
  //   } catch (err) {
  //     const error = parseError(err);
  //     toast.error(error.message, toastStyle.error);
  //   } finally {
  //     setLoadingForm(false);
  //   }
  // }

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // async function handleSubmitFormDocumentsFront(event: any) {
  //   event.preventDefault();

  //   const fileType = event.target?.files[0]?.type;
  //   if (
  //     fileType !== "image/png" &&
  //     fileType !== "image/jpeg" &&
  //     fileType !== "image/jpg" &&
  //     fileType !== "application/pdf"
  //   ) {
  //     toast.error(
  //       "Só é permitido arquivos do tipo PDF, PNG, JPG ou JPEG.",
  //       toastStyle.error
  //     );
  //     return;
  //   }

  //   // validar tamanho do arquivo no máximo 5mb
  //   if (event.target?.files[0]?.size > 5 * 1024 * 1024) {
  //     toast.error("O arquivo deve ter no máximo 5mb.", toastStyle.error);
  //     return;
  //   }

  //   try {
  //     setLoadingForm(true);
  //     const formData = new FormData();
  //     formData.append("file", event.target?.files[0]);
  //     await api.post(
  //       `/users/invite/${inviteId}/documents?type=FRONT`,
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );
  //     await refetch();
  //   } catch (err) {
  //     const error = parseError(err);
  //     toast.error(error.message, toastStyle.error);
  //   } finally {
  //     setLoadingForm(false);
  //   }
  // }

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // async function handleSubmitFormDocumentsVerse(event: any) {
  //   event.preventDefault();

  //   const fileType = event.target?.files[0]?.type;
  //   if (
  //     fileType !== "image/png" &&
  //     fileType !== "image/jpeg" &&
  //     fileType !== "image/jpg" &&
  //     fileType !== "application/pdf"
  //   ) {
  //     toast.error(
  //       "Só é permitido arquivos do tipo PDF, PNG, JPG ou JPEG.",
  //       toastStyle.error
  //     );
  //     return;
  //   }

  //   // validar tamanho do arquivo no máximo 5mb
  //   if (event.target?.files[0]?.size > 5 * 1024 * 1024) {
  //     toast.error("O arquivo deve ter no máximo 5mb.", toastStyle.error);
  //     return;
  //   }

  //   try {
  //     setLoadingForm(true);
  //     const formData = new FormData();
  //     formData.append("file", event.target?.files[0]);
  //     await api.post(
  //       `/users/invite/${inviteId}/documents?type=VERSE`,
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );
  //     await refetch();
  //   } catch (err) {
  //     const error = parseError(err);
  //     toast.error(error.message, toastStyle.error);
  //   } finally {
  //     setLoadingForm(false);
  //   }
  // }

  function handleLogout() {
    logout();
    navigate("/auth/login");
  }

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col items-center p-3 sm:p-6 lg:p-8 bg-white">
        <img
          className="mx-auto h-36 w-auto"
          src={customer.logo.dark}
          alt="Hero Bank"
        />

        {result?.account?.status === "PENDING" && (
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
                            value={Format.CPF(result?.account.document)}
                            disabled
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
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loadingForm}
                  >
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
        )}

        {result?.account?.status === "WAITING_INDIVIDUAL" && (
          <Card className="mx-auto max-w-xl w-full">
            <CardHeader>
              <CardTitle className="text-xl">Dados pessoais</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para criar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitFormIndividual}>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      {isLoading ? (
                        <>
                          <Skeleton className="w-full h-[20px] rounded-sm" />
                          <Skeleton className="w-full h-[30px] rounded-sm" />
                        </>
                      ) : (
                        <>
                          <Label htmlFor="document-number">E-mail</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
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
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* <div className="grid gap-2">
                      {isLoading ? (
                        <>
                          <Skeleton className="w-full h-[20px] rounded-sm" />
                          <Skeleton className="w-full h-[30px] rounded-sm" />
                        </>
                      ) : (
                        <>
                          <Label htmlFor="document-local">
                            Local de expedição
                          </Label>
                          <Input
                            id="document-local"
                            placeholder="DETRAN"
                            value={documentExpedido}
                            onChange={(e) =>
                              setDocumentExpedido(e.target.value)
                            }
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
                          <Label htmlFor="document-date">
                            Data de expedição
                          </Label>
                          <Input
                            id="document-date"
                            placeholder="20/08/2019"
                            value={documentDataExpedicao}
                            onChange={(e) =>
                              setDocumentDataExpedicao(
                                Format.Date(e.target.value)
                              )
                            }
                          />
                        </>
                      )}
                    </div> */}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      {isLoading ? (
                        <>
                          <Skeleton className="w-full h-[20px] rounded-sm" />
                          <Skeleton className="w-full h-[30px] rounded-sm" />
                        </>
                      ) : (
                        <>
                          <Label htmlFor="birthdate">Data de nascimento</Label>
                          <Input
                            id="birthdate"
                            placeholder="10/03/1984"
                            value={birthDate}
                            onChange={(e) =>
                              setBirthDate(Format.Date(e.target.value))
                            }
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
                          <Label htmlFor="mother-name">
                            Nome da mãe (Igual do documento)
                          </Label>
                          <Input
                            id="mother-name"
                            placeholder="Nome da mãe"
                            value={motherName}
                            onChange={(e) => setMotherName(e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loadingForm}
                  >
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
            </CardContent>
          </Card>
        )}

        {result?.account?.status === "WAITING_ADDRESS" && (
          <Card className="mx-auto max-w-xl lg:w-full">
            <CardHeader>
              <CardTitle className="text-xl">Endereço</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para criar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitFormAddress}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    {isLoading ? (
                      <>
                        <Skeleton className="w-full h-[20px] rounded-sm" />
                        <Skeleton className="w-full h-[30px] rounded-sm" />
                      </>
                    ) : (
                      <>
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          type="cep"
                          placeholder="00000-000"
                          value={zipCode}
                          onChange={(e) =>
                            setZipCode(Format.ZipCode(e.target.value))
                          }
                        />
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      {isLoading ? (
                        <>
                          <Skeleton className="w-full h-[20px] rounded-sm" />
                          <Skeleton className="w-full h-[30px] rounded-sm" />
                        </>
                      ) : (
                        <>
                          <Label htmlFor="street">Endereço</Label>
                          <Input
                            id="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
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
                          <Label htmlFor="numberStreet">Número</Label>
                          <Input
                            id="numberStreet"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            ref={numberInputRef}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      {isLoading ? (
                        <>
                          <Skeleton className="w-full h-[20px] rounded-sm" />
                          <Skeleton className="w-full h-[30px] rounded-sm" />
                        </>
                      ) : (
                        <>
                          <Label htmlFor="complement">Complemento</Label>
                          <Input
                            id="complement"
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
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
                          <Label htmlFor="neighborhood">Bairro</Label>
                          <Input
                            id="neighborhood"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      {isLoading ? (
                        <>
                          <Skeleton className="w-full h-[20px] rounded-sm" />
                          <Skeleton className="w-full h-[30px] rounded-sm" />
                        </>
                      ) : (
                        <>
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
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
                          <Label htmlFor="state">Estado (UF)</Label>
                          <Input
                            id="state"
                            value={state}
                            maxLength={2}
                            onChange={(e) => setState(e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loadingForm}
                  >
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
            </CardContent>
          </Card>
        )}

        {result?.account?.status === "WAITING_DOCUMENT" && (
          <>
            {isOwem ? (
              <>
                <div className="mb-4 rounded-lg border-2 border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-900/20 max-w-xl w-full">
                  <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
                    ⚠️ <span className="font-bold">Importante:</span> Primeiro,
                    verifique e confirme seu e-mail. Somente depois de confirmar
                    o e-mail, você poderá enviar os documentos.
                    <br />
                    <span className="font-bold uppercase text-yellow-700 dark:text-yellow-300">
                      NÃO envie os documentos antes de confirmar o e-mail.
                    </span>
                  </p>
                </div>
                <OwemDocumentUpload
                  accountId={inviteId}
                  initialDocumentsStatus={result?.account?.documentsStatus}
                  initialDocumentType={result?.account?.documentType}
                  onComplete={() => refetch()}
                />
              </>
            ) : (
              <Card className="mx-auto max-w-md lg:w-full">
                <CardHeader>
                  <CardTitle className="text-xl">Documentos</CardTitle>
                  <CardDescription>
                    Faça o upload dos documentos abaixo para criar sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {link && (
                    <Button asChild>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        Enviar documentos
                      </a>
                    </Button>
                  )}

                  {!link && (
                    <>
                      <Loader2 className="animate-spin" />
                      <span className="ml-2">Carregando informações...</span>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {(result?.account?.status === "WAITING_ANALYSIS" ||
          result?.account?.status === "IN_ANALYSIS" ||
          result?.account?.status === "PRE_APPROVED") && (
          <Card className="mx-auto max-w-md lg:w-full">
            <CardHeader>
              <CardTitle className="text-xl">Parabéns</CardTitle>
              <CardDescription>
                Seu cadastro foi concluído com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Aguarde enquanto processamos a análise dos seus dados. Dentro de
                um 1 dia, enviaremos a resposta diretamente para o seu e-mail.
              </p>

              <Button onClick={handleLogout} className="mt-4">
                Sair
              </Button>
            </CardContent>
          </Card>
        )}

        {(result?.account?.status === "REJECTED" ||
          result?.account?.status === "RECEJECTED_KYC") && (
          <Card className="mx-auto max-w-md lg:w-full">
            <CardHeader>
              <CardTitle className="text-xl">Conta não aprovada!</CardTitle>
              <CardDescription>
                Infelizmente não conseguimos aprovar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Infelizmente não conseguimos aprovar sua conta. Você pode tentar
                novamente dentro de 60 dias.
              </p>

              <Button onClick={handleLogout} className="mt-4">
                Sair
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
