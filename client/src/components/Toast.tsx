import { AnimatePresence, motion } from "framer-motion";
import type { ToastState } from "@/pages/Terminal";

export default function Toast({ toast }: { toast: ToastState }) {
  return (
    <AnimatePresence>
      {toast.visible && (
        <motion.div
          className="ak-toast"
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: "spring", damping: 26, stiffness: 260 }}
        >
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
