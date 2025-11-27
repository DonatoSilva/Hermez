
// Conexión simple con WebSocket nativo en un hook
import { URL_LOCAL_BACKEND, URL_LOCAL_FRONTEND, URL_TUNNEL_BACKEND } from 'astro:env/client';
import { useEffect, useRef, useState } from 'react';

export function useDeliveryQuotesSocket({ token, protocol, host }: { token?: string, protocol?: string, host?: string }) {
    const [quotes, setQuotes] = useState<any[]>([]);
    const wsRef = useRef<WebSocket>(null);

    const url_backend = URL_LOCAL_BACKEND.split('http://')[1]
    const url_tunnel = URL_TUNNEL_BACKEND.split('https://')[1]
    const url_local = URL_LOCAL_FRONTEND.split('http://')[1]

    const url = host?.includes(url_local) ? url_backend : url_tunnel;
    const protocolWS = host?.includes(url_local) ? 'ws' : 'wss'; /// en caso de que el protocolo sea http, se usara ws y si es https, se usara wss
    const urlWS = `${protocolWS}://${url}/ws/deliveries/new-quotes/`;
    
    useEffect(() => {
        if (!token) {
            throw new Error('Token is required for WebSocket connection');
        }

        wsRef.current = new WebSocket(urlWS, [token]);
        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'initial_quotes') {
                    setQuotes(data.quotes);
                    return;
                }

                if (data.type === 'quote_created') {
                    setQuotes((prev: any[]) => [data.data, ...prev]);
                }


                if (data.type === 'quote_updated') {
                    setQuotes((prev: any[]) =>
                        prev.map((quote) => (quote.id === data.data.id ? data.data : quote))
                    );
                }
            } catch (err) {
            }
        };

        wsRef.current.onerror = (err) => {};

        wsRef.current.onclose = (ev) => {};

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