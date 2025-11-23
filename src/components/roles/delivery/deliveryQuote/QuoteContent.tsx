import { withState } from '@astrojs/react/actions';
import { toastStore } from '@stores/StoreToast';
import { actions } from 'astro:actions';
import React, { startTransition, useActionState } from 'react';
import QuoteItem from './QuoteItem';
import { useDeliveryQuotesSocket } from './hooks/useDeliveryQuotesSockets';

export interface QuoteContentProps {
    children?: React.ReactNode;
    token?: string;
    protocol?: string;
    host?: string;
}

export function QuoteContent({ token, children, protocol, host }: QuoteContentProps) {
    const [reqAddOffer, addOffer, pendingAddOffer = true] = useActionState(
            withState(actions.Delivery.addOfferByQuote),
            { data: [], error: undefined }
        )
    const { quotes } = useDeliveryQuotesSocket({ token, protocol, host });

    if (quotes.length === 0) return <>{children}</>;

    const handleNoInterested = (id: string) => {
        console.log('No estoy interesado en la cotización con ID:', id);
    }

    const handleAcceptQuote = async (id: string, proposedPrice: number) => {
        console.log('Acepto la cotización con ID:', id);
        try {
            const form = new FormData();
            form.set('quoteId', id);
            form.set('proposedPrice', proposedPrice.toString());
            const result =  startTransition(() => {
                addOffer(form)
                });
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
        console.log('Oferto la cotización con ID:', id);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map((quote) => (
                <QuoteItem key={quote.id} {...quote} onInterested={handleAcceptQuote} onNotInterested={handleNoInterested} onOffer={handleOffer} />
            ))}
        </div>
    );
}
