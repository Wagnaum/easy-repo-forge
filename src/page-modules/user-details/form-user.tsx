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
import { formatDocument, formatPhone } from "@/utils/format";
import { GetUserKycResponse } from "@/api/get-kyc";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O username deve conter pelo menos 2 caracteres" })
    .max(50, { message: "O username deve conter no máximo 50 caracteres" }),
  email: z.string(),
  document: z.string(),
  phone: z.string(),
});

interface FormUserProps {
  user: GetUserKycResponse;
}

export function FormUser({ user }: FormUserProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      document: formatDocument(user.document) || "",
      phone: formatPhone(user.phone) || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col lg:flex-row gap-4 w-full mb-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full mb-4">
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>Telefone</FormLabel>
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
