import { KycEmpty } from "./empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { GetKycProcessesResponse } from "@/api/get-kyc";

interface ProcessessProps {
  data: GetKycProcessesResponse[] | undefined;
}

export function Processess({ data }: ProcessessProps) {
  return (
    <>
      <p className="leading-7 [&:not(:first-child)]:mt-4 mb-4 text-muted-foreground w-full md:w-5/6 text-sm">
        Exibimos apenas os processos em que o usuário participa como{" "}
        <span className="font-bold">réu e/ou condenado</span>. Para mais
        informações, consulte a seção de consultas.
      </p>

      {data && data?.length === 0 && (
        <KycEmpty
          title="Informação não disponível"
          description="Processos que o usuário partitipa como réu e/ou condenado não encontrado ou não iniciado."
        />
      )}

      {data && data?.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableHead>Número</TableHead>
              <TableHead>Titulo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
            </TableHeader>
            <TableBody>
              {data?.map((process) => {
                return (
                  <TableRow key={process.id}>
                    <TableCell>{process?.number}</TableCell>
                    <TableCell>{process?.mainSubject}</TableCell>
                    <TableCell>
                      {process?.inferredBroad_CNJ_subject_name ||
                        process?.inferredCNJ_procedure_type_name}
                    </TableCell>
                    <TableCell>{process?.status}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Separator />
          <p className="text-sm text-gray-800 mt-4 font-semibold">
            Para acessar relatórios detalhados e processos completos, consulte a
            seção de consultas.
          </p>
        </>
      )}
    </>
  );
}
