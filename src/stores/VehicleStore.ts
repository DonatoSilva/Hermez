import { atom } from "nanostores";
import { type VehicleItemProps } from "../types/Vehicle/VehicleProps";

export const allVehicles = atom<VehicleItemProps[]>([]);
export const vehicleToEdit = atom<VehicleItemProps | null>(null);