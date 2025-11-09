import { withState } from "@astrojs/react/actions";
import VehicleItem from "@components/settings/vehicle/VehicleItem";
import { useStore } from "@nanostores/react";
import { allVehicles as $allVehicles, vehicleToEdit } from "@stores/VehicleStore";
import { actions } from "astro:actions";
import { useActionState, useEffect } from "react";
import type { VehicleItemProps } from "../../../types/Vehicle/VehicleProps";

export default function ContentVehicles() {
  const allAddresses = useStore($allVehicles);
  const [vehiclesResp, loadVehicles, isLoading] = useActionState(withState(actions.User.Vehicle.get), {
    data: [], error: undefined
  });

  useEffect(() => {
    if (!allAddresses?.length && !isLoading) {
      loadVehicles({} as FormData);
    }
  }, [allAddresses, isLoading, loadVehicles]);

  const handleEdit = (v: VehicleItemProps) => {
    vehicleToEdit.set(v);
    const btn = document.getElementById("open-modal-vehicle");
    btn?.dispatchEvent(new Event("click"));
  };

  const handleDelete = async (vehicleId: string) => {
    const fd = new FormData();
    fd.append("vehicleId", vehicleId);
    const res = await actions.User.Vehicle.delete(fd);
    if ((res as any)?.ok) {
      const nextVehicles = allAddresses.filter(v => v.vehicleId !== vehicleId);
      $allVehicles.set(nextVehicles);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {allAddresses?.map(v => (
        <VehicleItem key={v.vehicleId} vehicle={v} onEdit={handleEdit} onDelete={() => handleDelete(v.vehicleId)} />
      ))}
      {!allAddresses?.length && !isLoading && (
        <div className="text-gray-600">Sin vehículos registrados aún.</div>
      )}
    </div>
  );
}