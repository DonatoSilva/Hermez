
export const typeDelivery = {
    mercado: {
        label: "Mercado",
        image: "/images/tiposEnvio/mercado.png",
    },
    comida: {
        label: "Comida",
        image: "/images/tiposEnvio/comida.png",
    },
    alimento: {
        label: "Alimento",
        image: "/images/tiposEnvio/alimento.png",
    },
    persona: {
        label: "Persona",
        image: "/images/tiposEnvio/persona.png",
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
    origin: string
    pickup_address: string
    delivery_address: string
    vehicleType: string | null
    category: string | null
    notes: string
    payment_method: "efectivo" | "nequi"
    price: number
    observations?: string[],
    estimated_weight?: number | null, // Peso estimado
    estimated_size?: string | null, // Tamaño estimado
}