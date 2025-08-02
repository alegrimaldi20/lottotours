import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  onRemove: (id: string) => void;
}

export function SimpleToast({ id, title, description, variant = "default", onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      // Small delay to trigger animation
      const timer = setTimeout(() => {
        try {
          setIsVisible(true);
        } catch (error) {
          console.warn("Toast visibility error:", error);
        }
      }, 50);
      return () => {
        try {
          clearTimeout(timer);
        } catch (error) {
          console.warn("Toast timer cleanup error:", error);
        }
      };
    } catch (error) {
      console.warn("Toast effect error:", error);
    }
  }, []);

  const handleClose = () => {
    try {
      setIsVisible(false);
      setTimeout(() => {
        try {
          onRemove(id);
        } catch (error) {
          console.warn("Toast removal callback error:", error);
        }
      }, 300); // Wait for animation to complete
    } catch (error) {
      console.warn("Toast close error:", error);
    }
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-full max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 transform",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        variant === "destructive" 
          ? "bg-red-500 text-white border border-red-600" 
          : "bg-white text-slate-900 border border-slate-200"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && <div className="font-semibold text-sm">{title}</div>}
          {description && <div className="text-sm opacity-90 mt-1">{description}</div>}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface SimpleToasterProps {
  toasts: Array<{
    id: string;
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
  }>;
  onRemove: (id: string) => void;
}

export function SimpleToaster({ toasts, onRemove }: SimpleToasterProps) {
  return (
    <div className="fixed top-0 right-0 z-50 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{ marginTop: `${index * 80}px` }}
        >
          <SimpleToast {...toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}