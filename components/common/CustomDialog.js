import { useEffect } from "react";
import { X } from "lucide-react";

export function CustomDialog({ open, onOpenChange, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog Content */}
      <div className="relative z-10 w-full max-w-lg mx-4">{children}</div>
    </div>
  );
}

export function CustomDialogContent({ className = "", children, onClose }) {
  return (
    <div
      className={`bg-background border border-border shadow-lg rounded-lg p-6 relative ${className}`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-1 text-muted-foreground hover:text-foreground hover:bg-surface rounded-sm transition-colors"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
      {children}
    </div>
  );
}

export function CustomDialogHeader({ children, className = "" }) {
  return (
    <div className={`flex flex-col space-y-1.5 text-left mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CustomDialogTitle({ children, className = "" }) {
  return (
    <h2
      className={`text-lg font-semibold leading-none tracking-tight text-foreground ${className}`}
    >
      {children}
    </h2>
  );
}

export function CustomDialogFooter({ children, className = "" }) {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 ${className}`}
    >
      {children}
    </div>
  );
}
