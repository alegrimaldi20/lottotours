import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  onRemove: (id: string) => void;
  index: number;
}

export function InlineToast({ id, title, description, variant = "default", onRemove, index }: InlineToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mount animation
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setMounted(false);
    setTimeout(() => onRemove(id), 200);
  };

  const getIcon = () => {
    if (variant === "success") return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (variant === "destructive") return <AlertCircle className="h-5 w-5 text-red-600" />;
    return <CheckCircle className="h-5 w-5 text-blue-600" />;
  };

  const getStyles = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-50 border-red-200 text-red-800";
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div
      className={cn(
        "mb-4 p-4 border rounded-lg transition-all duration-200 relative",
        getStyles(),
        mounted ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          {title && <div className="font-semibold text-sm mb-1">{title}</div>}
          {description && <div className="text-sm">{description}</div>}
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 ml-2 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface InlineToasterProps {
  toasts: Array<{
    id: string;
    title?: string;
    description?: string;
    variant?: "default" | "destructive" | "success";
  }>;
  onRemove: (id: string) => void;
}

export function InlineToaster({ toasts, onRemove }: InlineToasterProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      {toasts.map((toast, index) => (
        <InlineToast
          key={toast.id}
          {...toast}
          onRemove={onRemove}
          index={index}
        />
      ))}
    </div>
  );
}