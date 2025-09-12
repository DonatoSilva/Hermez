import type { imageForType, statusColors } from "@components/history/historyItem/HistoryItem";

export interface HistoryItemProps {
    id: string;
    price: string;
    address: string;
    status: keyof typeof statusColors;
    type: keyof typeof imageForType;
}