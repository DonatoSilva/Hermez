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

  return (
    <div className="relative flex items-center justify-between pt-[92px] pb-[91px] w-[400px] h-[238px] mx-auto">
      {
        !offer.length ? (
          <div className="flex absolute top-0 left-[27px] flex-col items-center justify-between rounded-[10px] p-[10px_12px] w-[346px] h-[238px] overflow-hidden bg-white/0">
            <img src={imageSrc} alt="Esperando ofertas" className="w-[168px] h-[164px] cursor-crosshair hover:blur-[2px] transition-all duration-300" />
            <p className="w-[322px] text-center leading-6 text-black dark:text-H-blue-100 text-[20px]">{text}</p>
          </div>
        ) : (
            offer.map((off: any, index: number) => (
              <p>{JSON.stringify(off, null, 2)}</p>
            )
          )
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