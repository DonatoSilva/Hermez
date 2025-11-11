export interface VehicleType {
  id: string;
  name: string;
  description: string;
  max_weight_capacity_kg: string;
  max_volume_capacity_liters: string;
  passenger_capacity: number;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  delivery_categories: string[];
}

export const typeVehicle: Record<VehicleType["id"], { label: string; image: string }> = {
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