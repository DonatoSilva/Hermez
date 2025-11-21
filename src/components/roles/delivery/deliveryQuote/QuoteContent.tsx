import React from 'react';
import QuoteItem from './QuoteItem';
import { useDeliveryQuotesSocket } from './hooks/useDeliveryQuotesSockets';

export interface QuoteContentProps {
    children?: React.ReactNode;
    token?: string;
}

export function QuoteContent({ token, children }: QuoteContentProps) {
    const { quotes } = useDeliveryQuotesSocket({ token });
    console.log(quotes);
    if (quotes.length === 0) return <>{children}</>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map((quote) => (
                <QuoteItem key={quote.requesterName} {...quote} />
            ))}
        </div>
    );
}
