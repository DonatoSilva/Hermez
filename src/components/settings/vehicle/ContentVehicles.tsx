import { withState } from "@astrojs/react/actions";
import VehicleItem from "@components/settings/vehicle/VehicleItem";
import VehicleItemSkeleton from "@components/settings/vehicle/VehicleItemSkeleton";
import { useStore } from "@nanostores/react";
import { changeStatusModal, getStatusModal } from "@stores/ModalStore";
import { toastStore } from "@stores/StoreToast";
import { allVehicles as $allVehicles, vehicleToEdit } from "@stores/VehicleStore";
import { actions } from "astro:actions";
import { startTransition, useActionState, useCallback, useEffect, useState } from "react";
import type { VehicleItemProps } from "../../../types/Vehicle/VehicleProps";

const SkeletonVehicles = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <VehicleItemSkeleton key={i} />
    ))}
  </div>
);

export default function ContentVehicles({ emptyVehicle, currentVehicle }: { emptyVehicle?: React.JSX.Element, currentVehicle?: string | null }) {
  const [initLoad, setInitLoad] = useState(true);
  const [currentVehicleId, setCurrentVehicleId] = useState(currentVehicle);

  console.log(currentVehicleId);

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

  const handleEdit = useCallback((vehicleId: VehicleItemProps["vehicleId"]) => {
    const vehicle = allVehicles.find(v => v.vehicleId === vehicleId);
    if (vehicle) {
      vehicleToEdit.set(undefined);
      vehicleToEdit.set(vehicle);
      changeStatusModal(
        "form-vehicle" as never,
        {
          ...getStatusModal("form-vehicle" as never),
          metaData: {
            ...getStatusModal("form-vehicle" as never).metaData,
            title: "Editar vehículo",
          },
          action: "edit",
          isOpen: true,
        } as never
      );
    }
  }, [allVehicles]);


  const handleDelete = useCallback(async (vehicleId: string) => {
    const confirmed = window.confirm('¿Deseas eliminar este vehículo?');
    if (!confirmed) return;

    try {
      const form = new FormData();
      form.set('vehicleId', vehicleId);
      const { data, error } = await actions.User.Vehicle.delete(form);

      if (error) {
        toastStore.set({
          visible: true,
          message: error.message,
          type: 'error',
          autoClose: true,
          autoCloseDelay: 3000,
        });
        return;
      }

      $allVehicles.set(allVehicles.filter(v => v.vehicleId !== vehicleId));

      toastStore.set({
        visible: true,
        message: (data as any)?.message || 'Vehículo eliminado con éxito',
        type: 'success',
        autoClose: true,
        autoCloseDelay: 3000,
      });
    } catch (err) {
      toastStore.set({
        visible: true,
        message: 'Error inesperado al eliminar el vehículo',
        type: 'error',
        autoClose: true,
        autoCloseDelay: 3000,
      });
    }
  }, [allVehicles]);


  const handleSelectVehicle = useCallback(async (vehicleId: string) => {
    const form = new FormData();
    form.set('vehicleId', vehicleId);
    const { data, error } = await actions.User.Vehicle.setCurrentVehicle(form);
    if (error) {
      toastStore.set({
        visible: true,
        message: error.message,
        type: 'error',
        autoClose: true,
        autoCloseDelay: 3000,
      });
      return;
    }
    
    if (data) {
      toastStore.set({
        visible: true,
        message: 'Vehículo seleccionado con éxito',
        type: 'success',
        autoClose: true,
        autoCloseDelay: 3000,
      });

      $allVehicles.set(allVehicles.map(v => {
        if (v.vehicleId === vehicleId) {
          setCurrentVehicleId(vehicleId);
          return v;
        };
        return v;
      }));
    }
  }, [allVehicles]);


  if (isLoading || initLoad) {
    return <SkeletonVehicles />
  }

  if (!allVehicles?.length) {
    return (
      emptyVehicle
    );
  }

  console.log(currentVehicleId);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allVehicles?.map(v => (
        <VehicleItem key={v.vehicleId} vehicle={v} onEdit={handleEdit} onDelete={handleDelete} onSelectVehicle={handleSelectVehicle} isSelected={currentVehicleId === v.vehicleId}/>
      ))}
    </div>
  );
}