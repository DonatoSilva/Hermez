export type VehicleType =
  | "car"
  | "motorcycle"
  | "bicycle"
  | "truck"
  | "van";

export const typeVehicle: Record<VehicleType, { label: string; image: string }> = {
  car: { label: "Carro", image: "/images/tiposDeVehiculos/carro.png" },
  motorcycle: { label: "Motocicleta", image: "/images/tiposDeVehiculos/moto.png" },
  bicycle: { label: "Bicicleta", image: "/images/tiposDeVehiculos/bici.png" },
  truck: { label: "Camión", image: "/images/tiposDeVehiculos/camion.png" },
  van: { label: "Furgoneta", image: "/images/tiposDeVehiculos/furgoneta.png" },
};

export interface VehicleItemProps {
  vehicleId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color?: string | null;
  type?: VehicleType | null;
  isVerified?: boolean;
}