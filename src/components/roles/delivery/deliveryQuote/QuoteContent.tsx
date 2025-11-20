import React from 'react';
import QuoteItem from './QuoteItem';

export interface QuoteContentProps {
    children?: React.ReactNode;
}

export function QuoteContent({ children }: QuoteContentProps) {
    const quotes = [
        {
            pickupAddress: "Cra 80 #10-50, Medellín",
            dropoffAddress: "Calle 30 #25-15, Envigado",
            requesterName: "Ana Gómez",
            price: 8500,
            eta: "15 min",
            distance: "5.2 km",
            deliveryType: "documentos",
            onNotInterested: () => alert("No interesado 1"),
            onInterested: () => alert("Interesado 1"),
            onOffer: () => alert("Ofertar 1"),
        },
        {
            pickupAddress: "Av. El Poblado #5A-30",
            dropoffAddress: "Circular 4 #70-10, Laureles",
            requesterName: "Carlos Ruiz",
            price: 12000,
            eta: "25 min",
            distance: "8.1 km",
            deliveryType: "paquete",
            onNotInterested: () => alert("No interesado 2"),
            onInterested: () => alert("Interesado 2"),
            onOffer: () => alert("Ofertar 2"),
        },
    ];

    if (quotes.length === 0) return <>{children}</>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map((quote) => (
                <QuoteItem key={quote.requesterName} {...quote} />
            ))}
        </div>
    );
}
