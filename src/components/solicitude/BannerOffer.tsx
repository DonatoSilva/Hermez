import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { useOfferByQuote } from "./hooks/useOfferByQuote";

type BannerOfferProps = {
  quoteId: string | undefined;
  token: string;
  protocol?: string;
  host?: string;
  imageSrc?: string;
  text?: string;
  onPrev?: () => void;
  onNext?: () => void;
};

export function BannerOffer({
  quoteId,
  token,
  protocol,
  host,
  imageSrc = "/images/Casco-con-telaranas.png",
  text = "Esperando ofertas",
}: BannerOfferProps) {
  const { offer } = useOfferByQuote({ token, quoteId, protocol, host });
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < offer.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAccept = (offerId: string) => {
    console.log('Aceptar oferta:', offerId);
    // TODO: Implement accept logic
  };

  const handleCancel = (offerId: string) => {
    console.log('Cancelar oferta:', offerId);
    // TODO: Implement cancel logic
  };

  return (
    <div className="relative flex items-center justify-between pt-[92px] pb-[91px] w-[400px] h-[280px] mx-auto">
      {!offer.length ? (
        <div className="flex absolute top-0 left-[27px] flex-col items-center justify-between rounded-[10px] p-[10px_12px] w-[346px] h-[238px] overflow-hidden bg-white/0">
          <img 
            src={imageSrc} 
            alt="Esperando ofertas" 
            className="w-[168px] h-[164px] cursor-crosshair hover:blur-[2px] transition-all duration-300" 
          />
          <p className="w-[322px] text-center leading-6 text-black dark:text-H-blue-100 text-[20px]">
            {text}
          </p>
        </div>
      ) : (
        <div className="absolute top-0 left-[27px] w-[346px] h-[280px]">
          {[...offer, ...offer].map((off: any, index: number) => {
            const isActive = index === currentIndex;
            const offset = index - currentIndex;
            
            // Calculate z-index and visibility
            const zIndex = offer.length - Math.abs(offset);
            const isVisible = Math.abs(offset) <= 2;
            
            // Calculate transform based on position
            const translateY = offset * 8;
            const scale = isActive ? 1 : 1 - Math.abs(offset) * 0.05;
            const blur = isActive ? 0 : Math.abs(offset) * 2;
            const opacity = isActive ? 1 : Math.max(0.3, 1 - Math.abs(offset) * 0.2);

            if (!isVisible) return null;

            return (
              <div
                key={off.id ?? index}
                className="absolute top-0 left-0 w-full rounded-[10px] bg-white shadow-lg dark:bg-slate-800 overflow-hidden transition-all duration-500 ease-out"
                style={{
                  zIndex,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  filter: `blur(${blur}px)`,
                  opacity,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <div className="p-4 flex flex-col gap-4">
                  {/* Header con foto, nombre y username */}
                  <div className="flex items-center gap-3">
                    <img
                      src={off.delivery_person?.image_url || '/images/default-avatar.png'}
                      alt={off.delivery_person?.first_name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {off.delivery_person?.first_name} {off.delivery_person?.last_name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{off.delivery_person?.username}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${Number(off.proposed_price).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Información del vehículo */}
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon icon="mdi:motorbike" width={20} height={20} className="text-gray-600 dark:text-gray-300" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {off.vehicle?.type?.name || 'Vehículo'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Marca:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {off.vehicle?.brand}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Modelo:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {off.vehicle?.model}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Placa:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {off.vehicle?.licensePlate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Color:</span>
                        <div className="flex items-center gap-1">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: off.vehicle?.color }}
                          />
                          <span className="font-medium text-gray-900 dark:text-white text-xs">
                            {off.vehicle?.color}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleCancel(off.id)}
                      className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccept(off.id)}
                      disabled={!off.can_accept}
                      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        off.can_accept
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-slate-600 dark:text-gray-400'
                      }`}
                    >
                      Aceptar oferta
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation buttons */}
      {offer.length > 1 && (
        <div className="relative flex items-center self-stretch justify-between w-full z-10">
          <button
            type="button"
            aria-label="Anterior"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`cursor-pointer flex items-center rounded-full bg-[rgba(73,110,147,0.35)] hover:bg-[rgba(73,110,147,0.55)] p-[16px_14px_15px_16px] overflow-hidden rotate-180 transition-all ${
              currentIndex === 0 ? 'invisible' : ''
            }`}
          >
            <Icon icon="mdi:chevron-right" width={24} height={24} />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={handleNext}
            disabled={currentIndex === offer.length - 1}
            className={`cursor-pointer flex items-center rounded-full bg-[rgba(73,110,147,0.35)] hover:bg-[rgba(73,110,147,0.55)] p-[16px_14px_15px_16px] overflow-hidden transition-all ${
              currentIndex === offer.length - 1 ? 'invisible' : ''
            }`}
          >
            <Icon icon="mdi:chevron-right" width={24} height={24} />
          </button>
        </div>
      )}
    </div>
  );
}