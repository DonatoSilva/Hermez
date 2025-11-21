import { Icon } from "@iconify-icon/react";
import { useCallback } from "react";
import { typeVehicle, type VehicleItemProps } from "../../../types/Vehicle/VehicleProps";

function getContrastText(hex?: string | null) {
  if (!hex) return "#ffffff";
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#111827" : "#ffffff"; // dark text for light bg, white for dark bg
}

export default function VehicleItem({ vehicle, onEdit, onDelete }: {
  vehicle: VehicleItemProps;
  onEdit: (vehicleID: VehicleItemProps["vehicleId"]) => void;
  onDelete: (vehicleID: VehicleItemProps["vehicleId"]) => void;
}) {

  const color = vehicle.color || "#1d4ed8"; // fallback a azul de la empresa
  const textColor = getContrastText(color);
  const type = vehicle.type?.id || "180647da-e54e-441c-ae7b-8e5d078f31b5";
  const typeInfo = typeVehicle[type as keyof typeof typeVehicle];

  // Función para editar la dirección
  const handleEdit = useCallback(() => {
    onEdit?.(vehicle.vehicleId);
  }, [onEdit]);

  // Función para eliminar la dirección
  const handleDelete = useCallback(() => {
    onDelete?.(vehicle.vehicleId);
  }, [onDelete]);

  return (
    <div className="w-full rounded-md overflow-hidden border border-gray-200">
      <div className="relative w-full h-20 flex items-center justify-between px-3" style={{ backgroundColor: color, color: textColor }}>
        <span className="text-xl font-bold tracking-wider">{vehicle.licensePlate}</span>
        <img src={typeInfo.image} alt={typeInfo.label} className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 size-48 object-contain" loading="lazy" />
      </div>

      <div className={`p-3 flex items-center justify-between backdrop-blur-lg bg-[${color}]/10`}>
        <div className="text-sm text-gray-700">
          <span className="font-semibold">{vehicle.brand} {vehicle.model}</span>
          <div className="text-gray-500 ">Año: {vehicle.year}</div>
        </div>
        <div className="flex items-center gap-2 ${color}">
          <button onClick={handleEdit} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer">
            <Icon icon="iconamoon:edit-fill" width="20" height="20" />
          </button>
          <button onClick={handleDelete} className="p-2 rounded-md bg-red-100 group-hover:bg-red-200 transition cursor-pointer">
            <Icon icon="iconamoon:trash-simple-fill" width="20" height="20" className="group-hover:text-red-600 transition m-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}