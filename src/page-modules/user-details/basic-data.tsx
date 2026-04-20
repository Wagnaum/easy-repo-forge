import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GetKycResponse } from "@/api/get-kyc";
import { SkeletonUser } from "./skeleton-user";
import { FormUser } from "./form-user";
import { FormIndividual } from "./form-individual";
import { FormAddress } from "./form-address";
import { UserStatusComponent } from "@/components/user-status";
import { Badge } from "@/components/ui/badge";

interface UserBasicDataProps {
  data: GetKycResponse | undefined;
  isLoading: boolean;
}

export function UserBasicData({ data, isLoading }: UserBasicDataProps) {
  const navigate = useNavigate();

  function handleBack() {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/users");
    }
  }

  return (
    <>
      {data && (
        <>
          <div className="flex items-center gap-4 mb-1 flex-col lg:flex-row">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {data?.user.name}
            </h1>
            <div className="flex flex-1 justify-end gap-2">
              <Badge variant="outline">
                <UserStatusComponent status={data?.user.status} />
              </Badge>
            </div>
          </div>
          <div className="flex flex-1 justify-end mb-3">
            {(data?.user?.status === "REJECTED_KYC" ||
              data?.user?.status === "REJECTED") &&
              data?.user?.statusReason && (
                <span className="text-zinc-500 text-xs">
                  {data?.user?.statusReason}
                </span>
              )}
          </div>
          <Separator />
          <div className="mt-6 w-full">
            <Card rounded-sm>
              <CardHeader>
                <CardTitle>Dados do usuário</CardTitle>
                <CardDescription>
                  Informações cadastrais básicas fornecidas pelo usuário
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.user && <FormUser user={data.user} />}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 w-full">
            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle>Dados complementares</CardTitle>
                <CardDescription>
                  Informações cadastrais como RG, data de nascimento, etc.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.user && <FormIndividual individual={data.individual} />}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 w-full">
            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>
                  Endereço fornecido pelo usuário
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.user && <FormAddress address={data.address} />}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {isLoading && <SkeletonUser />}
    </>
  );
}
