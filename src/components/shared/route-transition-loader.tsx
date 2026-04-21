import { useEffect, useRef, useState } from "react";
import { useLocation, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { LottieLoader } from "./lottie-loader";

const MIN_DURATION_MS = 2000;

/**
 * Exibe o LottieLoader como overlay fullscreen durante mudanças de rota.
 * - Mantém visível por no mínimo 2s.
 * - Se o carregamento da rota demorar mais que 2s, mantém até terminar.
 * - Se terminar antes, espera completar os 2s mínimos.
 */
export function RouteTransitionLoader() {
  const location = useLocation();
  const isLoading = useRouterState({ select: (s) => s.isLoading });

  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);
  const lastPath = useRef(location.pathname);
  const startedAt = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  // Dispara o loader quando o pathname muda
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastPath.current = location.pathname;
      return;
    }

    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;

    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    startedAt.current = Date.now();
    setVisible(true);
  }, [location.pathname]);

  // Esconde o loader respeitando o mínimo de 2s, mas só após o carregamento terminar
  useEffect(() => {
    if (!visible) return;
    if (isLoading) return; // ainda carregando — mantém visível
    if (startedAt.current === null) return;

    const elapsed = Date.now() - startedAt.current;
    const remaining = Math.max(0, MIN_DURATION_MS - elapsed);

    hideTimer.current = window.setTimeout(() => {
      setVisible(false);
      startedAt.current = null;
      hideTimer.current = null;
    }, remaining);

    return () => {
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };
  }, [visible, isLoading]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="route-transition-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <LottieLoader size={140} label="Carregando..." />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
