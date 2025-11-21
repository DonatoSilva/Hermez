import React from 'react';
import QuoteItem from './QuoteItem';
import { useDeliveryQuotesSocket } from './hooks/useDeliveryQuotesSockets';

export interface QuoteContentProps {
    children?: React.ReactNode;
    token?: string;
}

export function QuoteContent({ token, children }: QuoteContentProps) {
    const { quotes } = useDeliveryQuotesSocket({ token });

    if (quotes.length === 0) return <>{children}</>;

    const handleNoInterested = (id: string) => {
        console.log('No estoy interesado en la cotización con ID:', id);
    }

    const handleAcceptQuote = (id: string) => {
        console.log('Acepto la cotización con ID:', id);
    }

    const handleOffer = (id: string) => {
        console.log('Oferto la cotización con ID:', id);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map((quote) => (
                <QuoteItem key={quote.id} {...quote} onInterested={handleNoInterested} onNotInterested={handleAcceptQuote} onOffer={handleOffer} />
            ))}
        </div>
    );
}
