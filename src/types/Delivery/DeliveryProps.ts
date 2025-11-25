
export const typeDelivery = {
    mercado: {
        label: "Mercado",
        image: "/images/tiposEnvio/mercado-min.png",
    },
    alimentos: {
        label: "Alimentos",
        image: "/images/tiposEnvio/alimentos-min.png",
    },
    persona: {
        label: "Persona",
        image: "/images/tiposEnvio/persona-min.png",
    },
    documentos: {
        label: "Documentos",
        image: "/images/tiposEnvio/sobre-min.png",
    },
    paquetes: {
        label: "Paquete",
        image: "/images/tiposEnvio/paquete-min.png",
    },
}

export interface DeliveryCategory {
    id: string;
    name: string;
    description?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}


export interface QuoteProps {
    category: {
        id: string;
        value: string;
    };
    client_price: number; // Corresponde a 'client_price'
    payment_method: "efectivo" | "nequi" | null;
    pickup_address: string;
    delivery_address: string;
    description: string; // Corresponde a 'description'
    observations: string[];
    vehicle_type: {
        id: string | null;
        value: string;
    };
    estimated_weight: number | null; // Peso estimado
    estimated_size: string | null; // Tamaño estimado
}

export interface DeliveryProps {
    id: string;
    client_id: string;
    delivery_person_id?: string | null;
    pickup_address: string;
    delivery_address: string;
    category_id: string;
    description?: string | null;
    estimated_weight?: number | null;
    estimated_size?: string | null;
    final_price: number;
    vehicle_id?: string | null;
    status: "assigned" | "picked_up" | "in_transit" | "delivered" | "paid" | "cancelled";
    created_at: string;
    updated_at: string;
    completed_at?: string | null;
    cancelled_at?: string | null;
    history_id: string;
    // Fields from the original interface that might still be relevant for frontend but not directly mapped to Django model
    payment_method?: "efectivo" | "nequi" | null; // Assuming this is part of the quote/offer, not the permanent delivery model
    observations?: string[]; // Assuming this is client-side notes
    origin?: string; // Assuming this is client-side data
}