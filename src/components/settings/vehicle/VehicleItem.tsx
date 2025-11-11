import { Icon } from "@iconify-icon/react";
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
  onEdit: (v: VehicleItemProps) => void;
  onDelete: () => void;
}) {
  const color = vehicle.color || "#1d4ed8"; // fallback a azul de la empresa
  const textColor = getContrastText(color);
  const type = vehicle.type || "car";
  const typeInfo = typeVehicle[type];

  return (
    <div className="w-full rounded-md overflow-hidden border border-gray-200">
      <div className="w-full h-20 flex items-center justify-between px-3" style={{ backgroundColor: color, color: textColor }}>
        <div className="flex items-center gap-2">
          <img src={typeInfo.image} alt={typeInfo.label} className="w-10 h-10 object-contain" loading="lazy" />
          <span className="font-semibold">{typeInfo.label}</span>
        </div>
        <span className="text-lg font-bold tracking-wider">{vehicle.licensePlate}</span>
      </div>

      <div className="p-3 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          <div>{vehicle.brand} {vehicle.model}</div>
          <div>Año: {vehicle.year}</div>
          {vehicle.isVerified && <div className="text-green-600">Verificado</div>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(vehicle)} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
            <Icon icon="mdi:pencil" className="text-H-blue-900" />
          </button>
          <button onClick={onDelete} className="p-2 rounded-md bg-red-100 hover:bg-red-200">
            <Icon icon="mdi:trash" className="text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}