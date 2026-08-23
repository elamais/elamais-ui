import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Toast, type ToastVariant } from "./Toast";
import "./toast.css";

export interface ShowToastOptions {
  variant?: ToastVariant;
  /** Time on screen in milliseconds. Defaults to 4000. */
  durationMs?: number;
}

export interface ToastContextValue {
  show: (message: string, options?: ShowToastOptions) => string;
  dismiss: (id: string) => void;
}

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  durationMs: number;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /** Default time on screen. Defaults to 4000ms per the design spec. */
  durationMs?: number;
}

export function ToastProvider({
  children,
  durationMs = 4000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message: string, options: ShowToastOptions = {}) => {
      counterRef.current += 1;
      const id = `ela-toast-${counterRef.current}`;
      const toast: ToastItem = {
        id,
        message,
        variant: options.variant ?? "brand",
        durationMs: options.durationMs ?? durationMs,
      };
      setToasts((current) => [...current, toast]);
      const timer = setTimeout(() => dismiss(id), toast.durationMs);
      timersRef.current.set(id, timer);
      return id;
    },
    [dismiss, durationMs],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="ela-toast-viewport" aria-label="Notificações">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            variant={toast.variant}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Access the toast API. Must be used inside a `ToastProvider`. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um <ToastProvider>.");
  }
  return context;
}
