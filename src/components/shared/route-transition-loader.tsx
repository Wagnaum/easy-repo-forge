import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { LottieLoader } from "./lottie-loader";

const MIN_DURATION_MS = 2000;

/**
 * Exibe o LottieLoader como overlay fullscreen por no mínimo 2s
 * sempre que a rota (pathname) muda.
 */
export function RouteTransitionLoader() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);
  const lastPath = useRef(location.pathname);

  useEffect(() => {
    // Não exibe no primeiro render (carregamento inicial da app)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastPath.current = location.pathname;
      return;
    }

    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), MIN_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

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
