import { AnimatePresence, motion } from "framer-motion";
import type { ToastState } from "@/lib/toast";

interface Props {
  toast: ToastState;
  onDismiss: () => void;
  onAction: () => void;
}

export default function Toast({ toast, onDismiss, onAction }: Props) {
  return (
    <AnimatePresence>
      {toast.visible && (
        <motion.div
          key={toast.id}
          className={`ak-toast ${toast.tone === "error" ? "is-error" : ""}`}
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: "spring", damping: 26, stiffness: 260 }}
          role={toast.tone === "error" ? "alert" : "status"}
          aria-live={toast.tone === "error" ? "assertive" : "polite"}
        >
          <div className="ak-toast-head">
            <div className="ak-toast-title">{toast.title}</div>
            <button className="ak-toast-dismiss" onClick={onDismiss}>
              Dismiss
            </button>
          </div>

          {toast.description && (
            <div className="ak-toast-body">{toast.description}</div>
          )}

          {toast.action && (
            <div className="ak-toast-actions">
              <button className="ak-toast-primary" onClick={onAction}>
                {toast.action.label}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
