import { statusModal } from '@stores/ModalStore';
import { toastStore } from '@stores/StoreToast';
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
    
    if (quotes.length === 0) return <>{children}</>;

    const handleNoInterested = (id: string) => {
        
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map((quote: any) => (
                <QuoteItem key={quote.id} {...quote} onInterested={handleAcceptQuote} onNotInterested={handleNoInterested} onOffer={handleOffer} />
            ))}
        </div>
    );
}
