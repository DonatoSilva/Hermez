// Hook para conectarse al WebSocket de quotes del usuario
import { URL_LOCAL_BACKEND, URL_LOCAL_FRONTEND, URL_TUNNEL_BACKEND } from 'astro:env/client';
import { useEffect, useRef, useState } from 'react';

type UseQuotesByUserProps = {
    token?: string;
    userId?: string;
    protocol?: string;
    host?: string;
};

export function useQuotesByUser({ token, userId, protocol, host }: UseQuotesByUserProps) {
    const [quotes, setQuotes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const url_backend = URL_LOCAL_BACKEND.split('http://')[1];
    const url_tunnel = URL_TUNNEL_BACKEND.split('https://')[1];
    const url_local = URL_LOCAL_FRONTEND.split('http://')[1];

    const url = host?.includes(url_local) ? url_backend : url_tunnel;
    const protocolWS = host?.includes(url_local) ? 'ws' : 'wss';
    const urlWS = `${protocolWS}://${url}/ws/deliveries/users/${userId}/quotes/`;

    useEffect(() => {
        if (!token || !userId) {
            setError('Token y userId son requeridos');
            setIsLoading(false);
            return;
        }

        try {
            wsRef.current = new WebSocket(urlWS, [token]);

            wsRef.current.onopen = () => {
                setError(null);
                setIsLoading(false);
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === 'user_quotes.initial' || data.type === 'user_quotes') {
                        setQuotes(data.quotes || []);
                        setIsLoading(false);
                    }

                    if (data.type === 'quote_created') {
                        setQuotes((prev) => [data.data, ...prev]);
                    }

                    if (data.type === 'quote_updated') {
                        setQuotes((prev) =>
                            prev.map((quote) =>
                                quote.id === data.data.id ? data.data : quote
                            )
                        );
                    }

                    if (data.type === 'quote_deleted') {
                        setQuotes((prev) => prev.filter((quote) => quote.id !== data.data.id));
                    }
                } catch (err) {
                    console.error('Error parsing WS message', err);
                    setError('Error al procesar datos del servidor');
                }
            };

            wsRef.current.onerror = (err) => {
                setError('Error de conexión con el servidor');
                setIsLoading(false);
            };

            wsRef.current.onclose = (ev) => {
                if (ev.code !== 1000) {
                    setError('Conexión cerrada inesperadamente');
                }
                setIsLoading(false);
            };

            return () => {
                wsRef.current?.close();
            };
        } catch (err) {
            console.error('Error creating WebSocket', err);
            setError('No se pudo establecer la conexión');
            setIsLoading(false);
        }
    }, [url, userId, token]);

    return {
        quotes,
        isLoading,
        error,
        send: (obj: any) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify(obj));
            }
        }
    };
}
