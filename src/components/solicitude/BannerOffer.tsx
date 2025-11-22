import { Icon } from "@iconify-icon/react";
import { useOfferByQuote } from "./hooks/OfferByQuote";

type BannerOfferProps = {
  quoteId: string | undefined;
  token: string;
  imageSrc?: string;
  text?: string;
  onPrev?: () => void;
  onNext?: () => void;
};

export function BannerOffer({
  quoteId,
  token,
  imageSrc = "/images/Casco-con-telaranas.png",
  text = "Esperando ofertas",
  onPrev,
  onNext,
}: BannerOfferProps) {
  const { offer } = useOfferByQuote({ token, quoteId });

  const lenRight = 0
  const lenLeft = 0

  const onAceptedOffers = () => {
    console.log('Acepted Offers');
  };

  return (
    <div className="relative flex items-center justify-between pt-[92px] pb-[91px] w-[400px] h-[238px] mx-auto">
      {
        !offer.length ? (
          <div className="flex absolute top-0 left-[27px] flex-col items-center justify-between rounded-[10px] p-[10px_12px] w-[346px] h-[238px] overflow-hidden bg-white/0">
            <img src={imageSrc} alt="Esperando ofertas" className="w-[168px] h-[164px] cursor-crosshair hover:blur-[2px] transition-all duration-300" />
            <p className="w-[322px] text-center leading-6 text-black dark:text-H-blue-100 text-[20px]">{text}</p>
          </div>
        ) : (
          offer.map((off: any, index: number) => {
            const etaParts = off.estimated_delivery_time?.split(':') || [];
            const hours = parseInt(etaParts[0] || '0', 10);
            const minutes = parseInt(etaParts[1] || '0', 10);
            const eta = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

            console.log('Offer:', off);

            return (
              <div
                key={off.id ?? index}
                className="flex absolute top-0 left-[27px] items-center justify-between rounded-[10px] p-3  w-[346px] h-[238px] bg-white shadow-md dark:bg-slate-800 overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={off.delivery_person?.avatar_url}
                    alt={off.delivery_person?.name}
                    className="w-[72px] h-[72px] rounded-full object-cover shadow-sm"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <p className="text-[18px] font-semibold text-black dark:text-white">
                        {off.delivery_person?.name}
                      </p>
                      <div className="flex items-center text-[13px] text-gray-500">
                        <Icon icon="mdi:star" width={16} height={16} className="text-yellow-400" />
                        <span className="ml-1">{off.delivery_person?.rating ?? '-'}</span>
                      </div>
                    </div>

                    <p className="text-[14px] text-gray-600 dark:text-gray-300 mt-1 max-w-[180px]">
                      {off.message}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-[13px] text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:clock-outline" width={14} height={14} />
                        <span>{eta}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:motorbike" width={14} height={14} />
                        <span>{off.vehicle?.type} · {off.vehicle?.plate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full py-1">
                  <div className="text-right">
                    <div className="text-[20px] font-bold text-black dark:text-white">
                      ${Number(off.proposed_price).toLocaleString()}
                    </div>
                    <div className={`mt-2 inline-block text-[12px] px-2 py-1 rounded ${
                      off.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      off.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {off.status}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      disabled={!off.can_accept}
                      className={`px-3 py-2 rounded text-sm ${off.can_accept ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                      aria-label={off.can_accept ? 'Aceptar oferta' : 'No disponible para aceptar'}
                    >
                      {off.can_accept ? 'Aceptar' : 'No disponible'}
                    </button>
                    <small className="text-[11px] text-gray-400">
                      {new Date(off.created_at).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            );
          })
        )
      }

      <div className="relative flex items-center self-stretch justify-between w-full">
        <button
          type="button"
          aria-label="Anterior"
          onClick={onPrev}
          className={`cursor-pointer flex items-center rounded-full ${lenLeft === 0 ? 'invisible' : ''} bg-[rgba(73,110,147,0.35)] p-[16px_14px_15px_16px] overflow-hidden rotate-180`}
        >
          <Icon icon="mdi:chevron-right" width={24} height={24} />
        </button>
        <button
          type="button"
          aria-label="Siguiente"
          onClick={onNext}
          className={`cursor-pointer flex items-center rounded-full ${lenRight === 0 ? 'invisible' : ''} bg-[rgba(73,110,147,0.35)] p-[16px_14px_15px_16px] overflow-hidden`}
        >
          <Icon icon="mdi:chevron-right" width={24} height={24} />
        </button>
      </div>
    </div>
  );

}