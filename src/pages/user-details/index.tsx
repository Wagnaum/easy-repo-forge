import { getKyc } from "@/api/get-kyc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { UserBasicData } from "./basic-data";
import { Documents } from "./documents/documents";
import { Kyc } from "./kyc";

export function UserDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["user-details:kyc", id],
    queryFn: () => getKyc({ userId: id }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    // refetchInterval: 1000 * 60, // 1 minute
  });

  return (
    <>
      <Tabs defaultValue="basic-data">
        <TabsList className="mb-4">
          <TabsTrigger value="basic-data">Dados Básicos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="kyc">Know Your Customer (KYC)</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-data">
          <UserBasicData data={data} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="documents">
          <Documents data={data} />
        </TabsContent>
        <TabsContent value="kyc">
          {data && <Kyc data={data} id={id} />}
        </TabsContent>
      </Tabs>
    </>
  );
}
