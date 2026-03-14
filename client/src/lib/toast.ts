export type ToastTone = "info" | "success" | "error";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastConfig {
  title: string;
  description?: string;
  tone?: ToastTone;
  action?: ToastAction;
  autoHideMs?: number;
}

export interface ToastState extends ToastConfig {
  id: number;
  visible: boolean;
}

export type ToastInput = string | ToastConfig;
export type ShowToast = (toast: ToastInput) => void;
