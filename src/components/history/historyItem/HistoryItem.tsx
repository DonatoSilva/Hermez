import BodyDetailsItem from "@components/history/deliverysDetails/BodyDetails";
import Modal from "@components/modals/Modal";
import { changeStatusModal, getStatusModal } from "src/stores/ModalStore";
import { typeDelivery } from "src/types/Delivery/DeliveryProps";
import type { HistoryItemProps } from "src/types/history/HistoryItemProps";

export const statusColors = {
  assigned: {color: "bg-yellow-500 text-white dark:text-yellow-900", label: "Asignado"},
  picked_up: {color: "bg-orange-500 text-white dark:text-orange-900", label: "Recogido"},
  in_transit: {color: "bg-blue-500 text-white dark:text-blue-900", label: "En tránsito"},
  delivered: {color: "bg-green-500 text-white dark:text-green-900", label: "Entregado"},
  paid: {color: "bg-purple-500 text-white dark:text-purple-900", label: "Pagado"},
  cancelled: {color: "bg-red-500 text-white dark:text-red-900", label: "Cancelado"},
};


function HistoryItem({ price, address, status, type, id }: HistoryItemProps) {
  const { image, label } = typeDelivery[type as keyof typeof typeDelivery] || {};

  return (
    <>
      <div
        className="flex relative md:flex-row items-center justify-between p-4 rounded-lg bg-H-blue-100 dark:bg-gray-800 overflow-auto w-full group cursor-pointer"
        id={id}
        onClick={() => {
          changeStatusModal(id as never, {
            ...getStatusModal(id as never),
            isOpen: true,
          } as never);
        }}
      >
        <img
          src={image}
          alt={`Imagen de animada en 3D de ${label}`}
          className="w-16 h-16 rounded-md group-hover:drop-shadow-lg/50 dark:drop-shadow-H-blue-300 transition-all duration-150"
        />
        <div className="flex-1 ml-4 ">
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            ${price}
          </p>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {address}
          </span>
        </div>
        <div
          className={`group-hover:shadow-lg dark:shadow-H-blue-700 transition-shadow duration-150 absolute top-0 right-0 px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium ${statusColors[status].color}`}
        >
          {statusColors[status].label}
        </div>
      </div>
      <Modal keyModal={id} title="Detalles del pedido">
        <BodyDetailsItem id={id} />
      </Modal>
    </>
  );
}

export default HistoryItem;
