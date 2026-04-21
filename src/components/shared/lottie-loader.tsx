import Lottie from "lottie-react";
import stricLogoAnimation from "@/assets/stric-logo.json";
import { cn } from "@/lib/utils";

interface LottieLoaderProps {
  /** Tamanho da animação em pixels. Default: 96 */
  size?: number;
  /** Texto opcional exibido abaixo da animação */
  label?: string;
  /** Mostrar como overlay fullscreen */
  fullscreen?: boolean;
  /** Mostrar centralizado dentro do container pai */
  inline?: boolean;
  className?: string;
}

export function LottieLoader({
  size = 96,
  label,
  fullscreen = false,
  inline = false,
  className,
}: LottieLoaderProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Lottie
        animationData={stricLogoAnimation}
        loop
        style={{ width: size, height: size }}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
        role="status"
        aria-live="polite"
      >
        {content}
      </div>
    );
  }

  if (inline) {
    return (
      <div className="flex w-full items-center justify-center py-16" role="status" aria-live="polite">
        {content}
      </div>
    );
  }

  return content;
}
