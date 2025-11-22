// Conexión simple con WebSocket nativo en un hook
import { useEffect, useRef, useState } from 'react';

export function useOfferByQuote({ token, quoteId }: { token?: string, quoteId?: string }) {
    const [offer, setOffer] = useState<any[]>([]);
    const wsRef = useRef<WebSocket>(null);
    const url = `ws://localhost:8000/ws/deliveries/quotes/${quoteId}/`;

    if (!token) {
        throw new Error('Token is required for WebSocket connection');
    }

    useEffect(() => {
        wsRef.current = new WebSocket(url, [token]);

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'offer_made') {
                    setOffer((prev: any[]) => [data.data, ...prev]);
                }

                if (data.type === 'offer_updated') {
                    setOffer((prev: any[]) =>
                        prev.map((offer) =>
                            offer.id === data.data.id ? data.data : offer
                        )
                    );
                }
            } catch (err) {
                console.error('Error parsing WS message', err);
            }
        };

        wsRef.current.onerror = (err) => {
            console.error('WS error', err);
        };

        wsRef.current.onclose = (ev) => {
            console.log('WS closed', ev.code, ev.reason);
            // opcional: reintentar conexión aquí
        };

        return () => {
            wsRef.current?.close();
        };
    }, [url]);

    return {
        offer, send: (obj: any) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify(obj));
            }
        }
    };
}