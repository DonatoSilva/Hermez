import type { statusColors } from "@components/history/historyItem/HistoryItem";
import type { typeDelivery } from "../Delivery/DeliveryProps";

export interface HistoryItemProps {
    id: string;
    price: string;
    address: string;
    status: keyof typeof statusColors;
    type: keyof typeof typeDelivery;
}