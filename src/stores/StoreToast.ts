import { map } from 'nanostores';

export type ToastType = "info" | "success" | "warning" | "error";
export interface ToastState {
    visible: boolean;
    title?: string;
    message: string;
    emoji?: string;
    type: ToastType;
    autoClose: boolean;
    autoCloseDelay: number;
}

export const toastStore = map<ToastState>({
    visible: false,
    title: undefined,
    message: "",
    emoji: "ℹ️",
    type: "info",
    autoClose: true,
    autoCloseDelay: 5000,
});
