import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addDays, format } from "date-fns";
import { GetIndividualKycResponse } from "@/api/get-kyc";

const formSchema = z.object({
  document_type: z.string(),
  document_number: z.string(),
  birthdate: z.string(),
  document_uf: z.string(),
  document_issuing: z.string(),
  document_date_issue: z.string().optional(),
  document_expiration: z.string().optional(),
  mother_name: z.string(),
  income: z.number(),
  publicly_exposed_person: z.string(),
  nationality: z.string(),
});

interface FormUserProps {
  individual: GetIndividualKycResponse;
}

export function FormIndividual({ individual }: FormUserProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document_type: "-",
      document_number: individual.documentNumber || "-",
      birthdate: individual?.birthDate
        ? format(addDays(new Date(individual.birthDate), 1), "dd/MM/yyyy")
        : "-",
      document_uf: individual.documentUf || "-",
      document_issuing: individual.documentIssuing || "",
      document_date_issue: individual?.documentDateIssue
        ? format(new Date(individual.documentDateIssue), "dd/MM/yyyy")
        : "-",
      document_expiration: individual?.documentExpiration
        ? format(new Date(individual.documentExpiration), "dd/MM/yyyy")
        : "-",
      mother_name: individual.motherName || "-",
      income: individual.income || 0,
      publicly_exposed_person: individual?.publiclyExposedPerson
        ? "Sim"
        : "Não",
      nationality: individual.nationality || "-",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col lg:flex-row gap-4 w-full mb-4">
          <FormField
            control={form.control}
            name="document_number"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Documento</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="document_uf"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>UF da expedição</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="document_issuing"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Expedido</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="document_date_issue"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Expedido em</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="document_expiration"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Expira em</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>

        {/* <Separator /> */}

        <div className="flex flex-col lg:flex-row gap-4 w-full mb-4 mt-4">
          <FormField
            control={form.control}
            name="mother_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome da Mãe</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nascionalidade</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="income"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Renda</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nascimento</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="publicly_exposed_person"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>PEP</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        {/* <Button type="submit">Submit</Button> */}
      </form>
    </Form>
  );
}
