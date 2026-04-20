// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

export function SkeletonUser() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-4 flex-col lg:flex-row">
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          <Skeleton className="w-[300px] h-8" />
        </h1>
        <div className="flex flex-1 justify-end">
          <Skeleton className="w-[150px] h-6" />
        </div>
      </div>
      <Separator />
      <div className="mt-4 w-full">
        <form className="w-full">
          <div className="flex flex-col lg:flex-row gap-4 w-full mb-4">
            <div className="w-full space-y-2">
              <Label>Nome</Label>
              <Skeleton className="w-full h-10" />
            </div>
            <div className="w-full space-y-2">
              <Label>E-mail</Label>
              <Skeleton className="w-full h-10" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 w-full mb-4">
            <div className="w-full space-y-2">
              <Label>CPF/CNPJ</Label>
              <Skeleton className="w-full h-10" />
            </div>

            <div className="w-full space-y-2">
              <Label>Telefone</Label>
              <Skeleton className="w-full h-10" />
            </div>
          </div>
        </form>
        <Separator />
      </div>

      <div className="mt-4 w-full">
        <h2 className="mb-4 flex-1 shrink-0 whitespace-nowrap text-lg font-normal tracking-tight sm:grow-0">
          Dados básicos
        </h2>
        <form className="w-full">
          <div className="flex flex-col lg:flex-row gap-4 w-full mb-4">
            <div className="w-full space-y-2">
              <Label>Documento</Label>
              <Skeleton className="w-full h-10" />
            </div>
            <div className="w-full space-y-2">
              <Label>UF da expedição</Label>
              <Skeleton className="w-full h-10" />
            </div>

            <div className="w-full space-y-2">
              <Label>Expedido</Label>
              <Skeleton className="w-full h-10" />
            </div>

            <div className="w-full space-y-2">
              <Label>Expedido em</Label>
              <Skeleton className="w-full h-10" />
            </div>

            <div className="w-full space-y-2">
              <Label>Expira em</Label>
              <Skeleton className="w-full h-10" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 w-full mb-4">
            <div className="w-full space-y-2">
              <Label>Nome da Mãe</Label>
              <Skeleton className="w-full h-10" />
            </div>
            <div className="w-full space-y-2">
              <Label>Nascionalidade</Label>
              <Skeleton className="w-full h-10" />
            </div>

            <div className="w-full space-y-2">
              <Label>Renda</Label>
              <Skeleton className="w-full h-10" />
            </div>

            <div className="w-full space-y-2">
              <Label>Nascimento</Label>
              <Skeleton className="w-full h-10" />
            </div>

            <div className="w-full space-y-2">
              <Label>PEP</Label>
              <Skeleton className="w-full h-10" />
            </div>
          </div>
        </form>
        <Separator />
      </div>

      <div className="mt-4 w-full">
        <h2 className="mb-4 flex-1 shrink-0 whitespace-nowrap text-lg font-normal tracking-tight sm:grow-0">
          Endereço
        </h2>
        <div className="flex flex-col lg:flex-row gap-4 w-full mb-4">
          <div className="w-full space-y-2">
            <Label>CEP</Label>
            <Skeleton className="w-full h-10" />
          </div>
          <div className="w-full space-y-2">
            <Label>Endereço</Label>
            <Skeleton className="w-full h-10" />
          </div>

          <div className="w-full space-y-2">
            <Label>Número</Label>
            <Skeleton className="w-full h-10" />
          </div>

          <div className="w-full space-y-2">
            <Label>Complemento</Label>
            <Skeleton className="w-full h-10" />
          </div>

          <div className="w-full space-y-2">
            <Label>Bairro</Label>
            <Skeleton className="w-full h-10" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full mb-4">
          <div className="w-full space-y-2">
            <Label>Cidade</Label>
            <Skeleton className="w-full h-10" />
          </div>
          <div className="w-full space-y-2">
            <Label>Estado</Label>
            <Skeleton className="w-full h-10" />
          </div>

          <div className="w-full space-y-2">
            <Label>Longitude</Label>
            <Skeleton className="w-full h-10" />
          </div>

          <div className="w-full space-y-2">
            <Label>Latitude</Label>
            <Skeleton className="w-full h-10" />
          </div>

          <div className="w-full space-y-2">
            <Label>Tipo</Label>
            <Skeleton className="w-full h-10" />
          </div>
        </div>
      </div>
    </div>
  );
}