// Conexión simple con WebSocket nativo en un hook
import { URL_LOCAL_BACKEND, URL_LOCAL_FRONTEND, URL_TUNNEL_BACKEND } from 'astro:env/client';
import { useEffect, useRef, useState } from 'react';

export function useOfferByQuote({ token, quoteId, protocol, host }: { token?: string, quoteId?: string, protocol?: string, host?: string }) {
    const [offer, setOffer] = useState<any[]>([]);
    const wsRef = useRef<WebSocket>(null);

    const url = host == URL_LOCAL_FRONTEND ? URL_LOCAL_BACKEND : URL_TUNNEL_BACKEND;
    const protocolWS = host == URL_LOCAL_FRONTEND ? 'ws' : 'wss'; /// en caso de que el protocolo sea http, se usara ws y si es https, se usara wss
    const urlWS = `${protocolWS}://${url}/ws/deliveries/quotes/${quoteId}/`;

    if (!token) {
        throw new Error('Token is required for WebSocket connection');
    }

    useEffect(() => {
        wsRef.current = new WebSocket(urlWS, [token]);

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