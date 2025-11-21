import { Icon } from '@iconify-icon/react';
import React from 'react';
import { typeDelivery } from 'src/types/Delivery/DeliveryProps';

export interface QuoteItemProps {
  id: string;
  pickup_address: string;
  delivery_address: string;
  client_price: number;
  category: string;
  distance: string;
  deliveryType: string;
  onNotInterested?: (id: string) => void;
  onInterested?: (id: string) => void;
  onOffer?: (id: string) => void;
}

const QuoteItem: React.FC<QuoteItemProps> = ({
  id,
  pickup_address,
  delivery_address,
  client_price,
  category,
  distance,
  onNotInterested,
  onInterested,
  onOffer
}) => {

  const handleNotInterested = () => {
    if (onNotInterested) {
      onNotInterested(id);
    }
  }

  const handleInterested = () => {
    if (onInterested) {
      onInterested(id);
    }
  }

  const handleOffer = () => {
    if (onOffer) {
      onOffer(id);
    }
  }

  return (
    <div className="relative border border-gray-200 rounded-lg p-3 flex flex-col gap-2 bg-white hover:shadow-sm w-full transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
      <div>
        <div className="text-2xl md:text-3xl font-bold dark:text-gray-200">${client_price.toLocaleString('es-CO')}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{category} · {distance ?? "distancia no disponible"}</div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-sm text-gray-700 flex items-center gap-2 dark:text-gray-300">
          <strong><Icon icon="solar:map-point-wave-bold-duotone" width="24" height="24" /></strong> {pickup_address}
        </div>
        <div className="text-sm text-gray-700 flex items-center gap-2 dark:text-gray-300">
          <strong><Icon icon="solar:map-point-wave-bold" width="24" height="24" /></strong> {delivery_address}
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="text-sm text-gray-700 flex items-center gap-2 dark:text-gray-300"><Icon icon="solar:user-bold" width="24" height="24" /> {"Prueba"}</div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={handleNotInterested}
            className="flex flex-row items-center justify-center gap-2.5 px-4 py-2 rounded-md transition-colors cursor-pointer bg-transparent text-H-blue-700 dark:text-H-blue-300 border border-H-blue-300 hover:border-H-blue-500 hover:text-H-blue-100 dark:border-H-blue-500 dark:hover:text-H-blue-100 dark:hover:border-H-blue-300"
          >
            <Icon icon="solar:close-square-bold" width="24" height="24" />
          </button>
          <button
            onClick={handleInterested}
            className="flex flex-row items-center justify-center gap-2.5 px-4 py-2 rounded-md transition-colors cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600"
          >
            <Icon icon="solar:check-circle-bold" width="24" height="24" />
          </button>
          <button
            onClick={handleOffer}
            className="flex flex-row items-center justify-center gap-2.5 px-4 py-2 rounded-md transition-colors cursor-pointer bg-H-blue-500 text-white hover:bg-H-blue-700"
          >
            Ofertar
          </button>
        </div>
      </div>
      <img src={typeDelivery[category.toLowerCase() as keyof typeof typeDelivery]?.image} alt="Delivery" className="absolute top-2 right-2 w-32 h-32 rounded-full" />
    </div>
  );
};

export default QuoteItem;