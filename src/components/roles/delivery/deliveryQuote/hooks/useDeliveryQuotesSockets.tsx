// Conexión simple con WebSocket nativo en un hook
import { useEffect, useRef, useState } from 'react';

export function useDeliveryQuotesSocket({ token }: { token?: string }) {
    const [quotes, setQuotes] = useState<any[]>([]);
    const wsRef = useRef<WebSocket>(null);
    const url = (token)
        ? `ws://localhost:8000/ws/deliveries/new-quotes/?token=${encodeURIComponent(token)}`
        : `ws://localhost:8000/ws/deliveries/new-quotes/`;

    useEffect(() => {
        wsRef.current = new WebSocket(url);

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Asumiendo que el servidor envía un objeto { type: 'new_quote', payload: {...} }
                if (data.type === 'initial_quotes') {
                    setQuotes(data.quotes);
                    return;
                }

                if (data.type === 'quote_created') {
                    console.log(data);
                    setQuotes((prev: any[]) => [data.data, ...prev]);
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