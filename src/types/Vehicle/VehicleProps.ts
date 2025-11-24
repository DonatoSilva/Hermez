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

export const typeVehicle = {
  moto: { label: "Moto", image: "/images/tiposDeVehiculos/moto-min.png" },
  motocarro: { label: "Motocarro", image: "/images/tiposDeVehiculos/mototaxi-min.png" },
  carro: { label: "Carro", image: "/images/tiposDeVehiculos/carro-azul-min.png" },
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
    name: VehicleType["name"];
  };
  isVerified?: boolean;
}