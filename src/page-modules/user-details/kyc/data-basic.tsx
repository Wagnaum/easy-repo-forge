import { DataTableRow } from "@/components/data-table/row";
import { DataTable } from "@/components/data-table/table";
import { Badge } from "@/components/ui/badge";
import { formatDocument } from "@/utils/format";
import { addDays, format } from "date-fns";
import { KycEmpty } from "./empty";
import {
  GetIndividualKycResponse,
  GetKycDataBasicResponse,
  GetUserKycResponse,
} from "@/api/get-kyc";

interface KycDataBasicProps {
  user: GetUserKycResponse | undefined;
  individual: GetIndividualKycResponse | undefined;
  kycDataBasic: GetKycDataBasicResponse | undefined;
  isLoading: boolean;
}

export function KycDataBasicPage({
  kycDataBasic,
  isLoading,
}: KycDataBasicProps) {
  return (
    <>
      {!isLoading && !kycDataBasic?.name ? (
        <KycEmpty
          title="Informação não disponível"
          description="Ainda não foi iniciado o processo de KYC para este usuário."
        />
      ) : (
        <>
          <p className="leading-7 [&:not(:first-child)]:mt-4 mb-4 text-muted-foreground w-full md:w-5/6 text-sm">
            Coletamos, agregamos e estruturamos dados de maneira meticulosa.
            Qualquer uso para{" "}
            <span className="font-bold">marketing ou outros fins</span> não
            autorizados é estritamente proibido.
          </p>

          <DataTable
            isLoading={isLoading}
            rows={5}
            title="Dados Básicos"
            description="Dados básicos de identificação da pessoa física."
          >
            {kycDataBasic && (
              <>
                <DataTableRow name="Nome">{kycDataBasic.name}</DataTableRow>
                <DataTableRow name="CPF">
                  {formatDocument(kycDataBasic?.document as string)}
                </DataTableRow>
                <DataTableRow name="Status CPF">
                  {kycDataBasic?.documentStatus}
                </DataTableRow>
                <DataTableRow name="Nome da mãe">
                  {kycDataBasic?.motherName}
                </DataTableRow>
                <DataTableRow name="Data de nascimento">
                  {kycDataBasic?.birthdate &&
                    format(
                      addDays(new Date(kycDataBasic.birthdate), 1),
                      "dd/MM/yyyy"
                    )}
                </DataTableRow>
                <DataTableRow name="Tem indicação de óbito">
                  {kycDataBasic?.hasObitIndication ? (
                    <Badge variant="destructive">Sim</Badge>
                  ) : (
                    <Badge variant={"secondary"}>Não</Badge>
                  )}
                </DataTableRow>
              </>
            )}
          </DataTable>

          <DataTable title="E-mail" isLoading={isLoading} rows={3}>
            {kycDataBasic?.emails?.Primary?.UserName && (
              <>
                <DataTableRow name="E-mail">
                  {kycDataBasic?.emails?.Primary?.UserName}@
                  {kycDataBasic?.emails?.Primary?.Domain}
                </DataTableRow>
                <DataTableRow name="Principal">
                  <Badge variant="secondary">Sim</Badge>
                </DataTableRow>
                {kycDataBasic?.emails?.Secondary?.UserName && (
                  <>
                    <div className="" />
                    <div className="mb-6" />
                    <DataTableRow name="E-mail">
                      {kycDataBasic?.emails?.Secondary?.UserName}@
                      {kycDataBasic?.emails?.Secondary?.Domain}
                    </DataTableRow>
                    <DataTableRow name="Principal">
                      <Badge variant="outline">Não</Badge>
                    </DataTableRow>
                  </>
                )}
              </>
            )}
          </DataTable>

          <DataTable title="Telefone" isLoading={isLoading} rows={4}>
            {kycDataBasic?.phones?.Primary?.Number && (
              <>
                <DataTableRow name="Telefone">
                  +{kycDataBasic?.phones?.Primary?.CountryCode}{" "}
                  {kycDataBasic?.phones?.Primary?.AreaCode}{" "}
                  {kycDataBasic?.phones?.Primary?.Number}
                </DataTableRow>
                <DataTableRow name="Principal">
                  <Badge variant="secondary">Sim</Badge>
                </DataTableRow>
                <DataTableRow name="Tipo">
                  {kycDataBasic?.phones?.Primary?.Type}
                </DataTableRow>
                {kycDataBasic?.phones?.Secondary?.Number && (
                  <>
                    <div className="" />
                    <div className="mb-6" />
                    <DataTableRow name="Telefone">
                      +{kycDataBasic?.phones?.Secondary?.CountryCode}{" "}
                      {kycDataBasic?.phones?.Secondary?.AreaCode}{" "}
                      {kycDataBasic?.phones?.Secondary?.Number}
                    </DataTableRow>
                    <DataTableRow name="Principal">
                      <Badge variant="outline">Não</Badge>
                    </DataTableRow>
                    <DataTableRow name="Tipo">
                      {kycDataBasic?.phones?.Secondary?.Type}
                    </DataTableRow>
                  </>
                )}
              </>
            )}
          </DataTable>

          <DataTable title="Endereço" isLoading={isLoading} rows={4}>
            {kycDataBasic?.addresses?.Primary?.AddressMain && (
              <>
                <DataTableRow name="Endereço">
                  {kycDataBasic?.addresses?.Primary?.AddressMain},{" "}
                  {kycDataBasic?.addresses?.Primary?.Number}
                </DataTableRow>
                <DataTableRow name="Complemento">
                  {kycDataBasic?.addresses?.Primary?.Complement}
                  {kycDataBasic?.addresses?.Primary?.ComplementType &&
                    `, ${kycDataBasic?.addresses?.Primary?.ComplementType}`}
                </DataTableRow>
                <DataTableRow name="Bairro">
                  {kycDataBasic?.addresses?.Primary?.Neighborhood}
                </DataTableRow>
                <DataTableRow name="CEP">
                  {kycDataBasic?.addresses?.Primary?.ZipCode}
                </DataTableRow>
                <DataTableRow name="Cidade">
                  {kycDataBasic?.addresses?.Primary?.City}
                </DataTableRow>
                <DataTableRow name="Estado">
                  {kycDataBasic?.addresses?.Primary?.State}
                </DataTableRow>
                <DataTableRow name="País">
                  {kycDataBasic?.addresses?.Primary?.Country}
                </DataTableRow>

                {kycDataBasic?.addresses?.Secondary?.AddressMain && (
                  <>
                    <div className="" />
                    <div className="mb-6" />
                    <DataTableRow name="Endereço">
                      {kycDataBasic?.addresses?.Secondary?.AddressMain},{" "}
                      {kycDataBasic?.addresses?.Secondary?.Number}
                    </DataTableRow>
                    <DataTableRow name="Complemento">
                      {kycDataBasic?.addresses?.Secondary?.Complement}
                      {kycDataBasic?.addresses?.Secondary?.ComplementType &&
                        `, ${kycDataBasic?.addresses?.Secondary?.ComplementType}`}
                    </DataTableRow>
                    <DataTableRow name="Bairro">
                      {kycDataBasic?.addresses?.Secondary?.Neighborhood}
                    </DataTableRow>
                    <DataTableRow name="CEP">
                      {kycDataBasic?.addresses?.Secondary?.ZipCode}
                    </DataTableRow>
                    <DataTableRow name="Cidade">
                      {kycDataBasic?.addresses?.Secondary?.City}
                    </DataTableRow>
                    <DataTableRow name="Estado">
                      {kycDataBasic?.addresses?.Secondary?.State}
                    </DataTableRow>
                    <DataTableRow name="País">
                      {kycDataBasic?.addresses?.Secondary?.Country}
                    </DataTableRow>
                  </>
                )}
              </>
            )}
          </DataTable>
        </>
      )}
    </>
  );
}
