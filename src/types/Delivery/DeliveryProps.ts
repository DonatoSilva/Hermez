import type { typeVehicle } from "../Vehicle/VehicleProps"

export const typeDelivery = {
    alimento: {
        label: "Alimento",
        image: "/images/tiposDeEntregas/alimento.png",
    },
    persona: {
        label: "Persona",
        image: "/images/tiposDeEntregas/persona.png",
    },
    documentos: {
        label: "Documentos",
        image: "/images/tiposDeEntregas/documentos.png",
    },
    paquete: {
        label: "Paquete",
        image: "/images/tiposDeEntregas/paquete.png",
    },
}

export interface DeliveryProps {
    origin: string
    destination: string
    vehicleType: keyof typeof typeVehicle
    deliveryType: keyof typeof typeDelivery
    notes: string
    paymentMethod: "efectivo" | "nequi"
    price: number
    observations?: string[]
}