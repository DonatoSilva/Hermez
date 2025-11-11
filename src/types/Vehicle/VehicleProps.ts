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
  "2223f9c0-d6a2-4937-abe5-e196b500400f": { label: "Moto", image: "/images/tiposDeVehiculos/moto-min.png" },
  "c6f98b68-3886-4a97-8edf-88caf0b8b488": { label: "Moto CArro", image: "/images/tiposDeVehiculos/mototaxi-min.png" },
  "180647da-e54e-441c-ae7b-8e5d078f31b5": { label: "Carro", image: "/images/tiposDeVehiculos/carro-azul-min.png" },
};

export interface VehicleItemProps {
  vehicleId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color?: string | null;
  type?: {
    id: VehicleType["id"];
  };
  isVerified?: boolean;
}