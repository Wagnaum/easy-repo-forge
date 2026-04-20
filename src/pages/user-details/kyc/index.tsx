import { GetKycResponse } from "@/api/get-kyc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserStatusComponent } from "@/components/user-status";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { KycDataBasicPage } from "./data-basic";
import { Processess } from "./processess";

interface UserBasicDataProps {
  data: GetKycResponse | undefined;
  id: string;
}

export function Kyc({ data }: UserBasicDataProps) {
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
          <div className="flex items-center gap-4 mb-4 flex-col lg:flex-row">
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
            <div className="flex flex-1 justify-end">
              <Badge variant="outline">
                <UserStatusComponent status={data?.user.status} />
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="mt-4 w-full">
            <Tabs defaultValue="kyc-data">
              <TabsList className="mb-4">
                <TabsTrigger value="kyc-data">Dados Básicos</TabsTrigger>
                <TabsTrigger value="processess">Processos</TabsTrigger>
              </TabsList>
              <TabsContent value="kyc-data">
                <KycDataBasicPage
                  user={data?.user}
                  individual={data?.individual}
                  kycDataBasic={data?.kycDataBasic}
                  isLoading={false}
                />
              </TabsContent>
              <TabsContent value="processess">
                <Processess data={data?.kycProcesses} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </>
  );
}
