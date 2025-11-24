
// Conexión simple con WebSocket nativo en un hook
import { URL_LOCAL_BACKEND } from 'astro:env/client';
import { useEffect, useRef, useState } from 'react';

export function useDeliveryQuotesSocket({ token, protocol, host }: { token?: string, protocol?: string, host?: string }) {
    const [quotes, setQuotes] = useState<any[]>([]);
    const wsRef = useRef<WebSocket>(null);
    const protocolWS ='ws';
    const url = `${protocolWS}://${URL_LOCAL_BACKEND.split("/").pop()}/ws/deliveries/new-quotes/`;


    useEffect(() => {
        if (!token) {
            throw new Error('Token is required for WebSocket connection');
        }

        wsRef.current = new WebSocket(url, [token]);

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                console.log("Received data:", data);

                if (data.type === 'initial_quotes') {
                    setQuotes(data.quotes);
                    return;
                }

                if (data.type === 'quote_created') {
                    console.log(data);
                    setQuotes((prev: any[]) => [data.data, ...prev]);
                }


                if (data.type === 'quote_expired') {
                    setQuotes((prev: any[]) =>
                        prev.filter((quote) => quote.id !== data.data.id)
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
        quotes, send: (obj: any) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify(obj));
            }
        }
    };
}