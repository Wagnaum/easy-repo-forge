import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function ErrorPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-36">
      <div className="mb-6 text-balance text-center">
        Algo deu errado. Se o erro persistir, entre em contato com o suporte.
      </div>
      <Link to="/">
        <Button className="ml-4">Voltar para a página inicial</Button>
      </Link>
    </div>
  );
}