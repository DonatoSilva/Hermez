import { Icon } from '@iconify-icon/react';
import { useStore } from '@nanostores/react';
import { statusModal } from '@stores/ModalStore';
import { toastStore } from '@stores/StoreToast';
import { isAvailable as isAvailableStore } from '@stores/UserStore';
import { actions } from 'astro:actions';
import React from 'react';
import QuoteItem from './QuoteItem';
import { useDeliveryQuotesSocket } from './hooks/useDeliveryQuotesSockets';

export interface QuoteContentProps {
    children?: React.ReactNode;
    token?: string;
    protocol?: string;
    host?: string;
}

export function QuoteContent({ token, children, protocol, host }: QuoteContentProps) {
    const { quotes } = useDeliveryQuotesSocket({ token, protocol, host });
    const isAvailable = useStore(isAvailableStore);
    const [localQuotes, setLocalQuotes] = React.useState<any[]>([]);

    React.useEffect(() => {
        setLocalQuotes(quotes);
    }, [quotes]);

    const handleNoInterested = (id: string) => {
        setLocalQuotes(prev => prev.filter(q => q.id !== id));
    }

    const handleAcceptQuote = async (id: string, proposedPrice: number) => {
        try {
            const form = new FormData();
            form.set('quote_id', id);
            form.set('proposed_price', proposedPrice.toString());
            const { error } =  await actions.Delivery.addOfferByQuote(form)

            if (error) {
                throw error;
            }

            toastStore.set({
                visible: true,
                type: 'success',
                message: 'Cotización aceptada correctamente',
                autoClose: true,
                autoCloseDelay: 3000,
            });
        } catch (error) {
            console.error('Error accepting quote:', error);
            toastStore.set({
                visible: true,
                message: 'Error al aceptar la cotización',
                type: 'error',
                autoClose: true,
                autoCloseDelay: 3000,
            })
        }
    }

    const handleOffer = (id: string) => {
        statusModal.setKey('quoteOffer', {
            isOpen: true,
            metaData: {
                title: 'Realizar oferta',
                'quote_id': id,
            }
        })
    }

    return (
        isAvailable ? (
            localQuotes.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localQuotes.map((quote: any) => <QuoteItem key={quote.id} {...quote} onInterested={handleAcceptQuote} onNotInterested={handleNoInterested} onOffer={handleOffer} />)}
            </div> : <>{children}</>
        ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
                <Icon icon="solar:bar-chair-bold-duotone" width="65" height="65" />
                <p className="text-lg font-semibold text-gray-700">
                    Tu estado está en ocupado, por lo tanto no recibes solicitudes de domicilios
                </p>
            </div>
        )
    );
}
