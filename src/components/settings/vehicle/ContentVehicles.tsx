import { withState } from "@astrojs/react/actions";
import VehicleItem from "@components/settings/vehicle/VehicleItem";
import VehicleItemSkeleton from "@components/settings/vehicle/VehicleItemSkeleton";
import { useStore } from "@nanostores/react";
import { allVehicles as $allVehicles, vehicleToEdit } from "@stores/VehicleStore";
import { actions } from "astro:actions";
import { startTransition, useActionState, useEffect, useState } from "react";
import type { VehicleItemProps } from "../../../types/Vehicle/VehicleProps";

const SkeletonVehicles = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <VehicleItemSkeleton key={i} />
    ))}
  </div>
);

export default function ContentVehicles({ emptyVehicle }: { emptyVehicle?: React.JSX.Element }) {
  const [initLoad, setInitLoad] = useState(true);

  const allVehicles = useStore($allVehicles);
  const [vehiclesResp, loadVehicles, isLoading] = useActionState(withState(actions.User.Vehicle.get), {
    data: [], error: undefined
  });

  useEffect(() => {
    startTransition(() => {
      loadVehicles(new FormData());
    })
  }, []);

  useEffect(() => {
    if (!isLoading && initLoad) {
      setInitLoad(false);
    }

    if (vehiclesResp?.data) {
      $allVehicles.set(vehiclesResp.data);
    }
  }, [isLoading])

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
      const nextVehicles = allVehicles.filter(v => v.vehicleId !== vehicleId);
      $allVehicles.set(nextVehicles);
    }
  };

  if (isLoading || initLoad) {
    return <SkeletonVehicles />
  }

  if (!allVehicles?.length) {
    return (
      emptyVehicle
    );
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allVehicles?.map(v => (
        <VehicleItem key={v.vehicleId} vehicle={v} onEdit={handleEdit} onDelete={() => handleDelete(v.vehicleId)} />
      ))}
    </div>
  );
}