import { Icon } from '@iconify-icon/react';
import React from 'react';
import { typeDelivery } from 'src/types/Delivery/DeliveryProps';

export interface QuoteItemProps {
  pickupAddress: string;
  dropoffAddress: string;
  requesterName: string;
  price: number;
  eta: string;
  distance: string;
  deliveryType: string;
  onNotInterested?: () => void;
  onInterested?: () => void;
  onOffer?: () => void;
}

const QuoteItem: React.FC<QuoteItemProps> = ({
  pickupAddress,
  dropoffAddress,
  requesterName,
  price,
  eta,
  distance,
  deliveryType,
  onNotInterested,
  onInterested,
  onOffer
}) => {
  return (
    <div className="relative border border-gray-200 rounded-lg p-3 flex flex-col gap-2 bg-white hover:shadow-sm w-full transition-shadow duration-300">
      <div>
        <div className="text-2xl md:text-3xl font-bold">${price.toLocaleString('es-CO')}</div>
        <div className="text-xs text-gray-500">{eta} · {distance}</div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-sm text-gray-700 flex items-center gap-2">
          <strong><Icon icon="solar:map-point-wave-bold-duotone" width="24" height="24" /></strong> {pickupAddress}
        </div>
        <div className="text-sm text-gray-700 flex items-center gap-2">
          <strong><Icon icon="solar:map-point-wave-bold" width="24" height="24" /></strong> {dropoffAddress}
        </div>
      </div>

      <div className="flex justify-between items-center mt-1">
        <div className="text-sm text-gray-700">{requesterName}</div>
        <div className="flex gap-2">
          <button
            onClick={onNotInterested}
            className="bg-white border border-gray-200 py-2 px-3 rounded-md cursor-pointer text-gray-500 text-sm hover:bg-gray-50 transition-colors"
          >
            No interesa
          </button>
          <button
            onClick={onInterested}
            className="bg-emerald-500 text-white py-2 px-3 rounded-md cursor-pointer text-sm hover:bg-emerald-600 transition-colors"
          >
            Interesado
          </button>
          <button
            onClick={onOffer}
            className="bg-blue-600 text-white py-2 px-3 rounded-md cursor-pointer text-sm hover:bg-blue-700 transition-colors"
          >
            Ofertar
          </button>
        </div>
      </div>
      <img src={typeDelivery[deliveryType as keyof typeof typeDelivery].image} alt="Delivery" className="absolute top-2 right-2 w-12 h-12 rounded-full" />
    </div>
  );
};

export default QuoteItem;