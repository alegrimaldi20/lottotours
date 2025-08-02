import { useState, useCallback, useRef, useEffect } from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastId = 0;

export function useLocaleSafeToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    try {
      const id = `toast-${++toastId}-${Date.now()}`;
      const newToast = { id, ...toast };
      
      // Use functional update to avoid stale closures
      setToasts(prev => {
        // Limit to 3 toasts maximum to prevent DOM overload
        const filtered = prev.slice(-2);
        return [...filtered, newToast];
      });
      
      // Auto-remove after 4 seconds with proper cleanup
      const timeout = setTimeout(() => {
        removeToast(id);
      }, 4000);
      
      timeoutRefs.current.set(id, timeout);
      
      return id;
    } catch (error) {
      console.warn("Toast creation error:", error);
      return "";
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    try {
      // Clear timeout if it exists
      const timeout = timeoutRefs.current.get(id);
      if (timeout) {
        clearTimeout(timeout);
        timeoutRefs.current.delete(id);
      }
      
      // Remove toast with functional update
      setToasts(prev => prev.filter(toast => toast.id !== id));
    } catch (error) {
      console.warn("Toast removal error:", error);
    }
  }, []);

  const toast = useCallback((options: Omit<Toast, "id">) => {
    return addToast(options);
  }, [addToast]);

  const clearAll = useCallback(() => {
    try {
      // Clear all timeouts
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current.clear();
      
      // Clear all toasts
      setToasts([]);
    } catch (error) {
      console.warn("Clear all toasts error:", error);
    }
  }, []);

  return {
    toasts,
    toast,
    removeToast,
    clearAll,
  };
}