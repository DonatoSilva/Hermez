// Conexión simple con WebSocket nativo en un hook
import { URL_LOCAL_BACKEND } from 'astro:env/client';
import { useEffect, useRef, useState } from 'react';

export function useOfferByQuote({ token, quoteId, protocol, host }: { token?: string, quoteId?: string, protocol?: string, host?: string }) {
    const [offer, setOffer] = useState<any[]>([]);
    const wsRef = useRef<WebSocket>(null);
    const protocolWS ='ws';
        
    const url = `${protocolWS}://${URL_LOCAL_BACKEND.split("/").pop()}/ws/deliveries/quotes/${quoteId}/`;

    if (!token) {
        throw new Error('Token is required for WebSocket connection');
    }

    useEffect(() => {
        wsRef.current = new WebSocket(url, [token]);

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'initial_quotes') {
                    setOffer(data.quotes[0].offers);
                }

                if (data.type === 'offer_deleted') {
                    setOffer((prev: any[]) => prev.filter((offer) => offer.id !== data.data.id));
                }

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