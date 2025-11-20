import type { typeVehicle } from "../Vehicle/VehicleProps"

export const typeDelivery = {
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
    paquete: {
        label: "Paquete",
        image: "/images/tiposEnvio/paquete-min.png",
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