// Hook para conexión WebSocket de entregas del domiciliario
import { URL_LOCAL_BACKEND, URL_LOCAL_FRONTEND, URL_TUNNEL_BACKEND } from 'astro:env/client';
import { useEffect, useRef, useState } from 'react';

export interface Delivery {
    id: string;
    client: {
        id: string;
        first_name: string;
        last_name: string;
        username?: string;
        image_url?: string;
    };
    pickup_address: string;
    delivery_address: string;
    status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'paid';
    final_price: string;
    created_at: string;
    updated_at?: string;
}

export function useDriverDeliveries({ 
    token, 
    userId, 
    protocol, 
    host 
}: { 
    token?: string;
    userId?: string;
    protocol?: string;
    host?: string;
}) {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const wsRef = useRef<WebSocket | null>(null);

    const url_backend = URL_LOCAL_BACKEND.split('http://')[1];
    const url_tunnel = URL_TUNNEL_BACKEND.split('https://')[1];
    const url_local = URL_LOCAL_FRONTEND.split('http://')[1];

    const url = host?.includes(url_local) ? url_backend : url_tunnel;
    const protocolWS = host?.includes(url_local) ? 'ws' : 'wss';
    const urlWS = `${protocolWS}://${url}/ws/deliveries/drivers/${userId || 'me'}/deliveries/`;

    if (!token) {
        throw new Error('Token is required for WebSocket connection');
    }

    useEffect(() => {
        wsRef.current = new WebSocket(urlWS, [token]);

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // Evento inicial con lista de entregas en curso
                if (data.type === 'driver_deliveries.initial') {
                    setDeliveries(data.deliveries || []);
                }

                // Nueva entrega asignada
                if (data.type === 'delivery_assigned' || data.type === 'delivery_created' || data.type === 'delivery.created') {
                    setDeliveries((prev) => {
                        // Verificar si ya existe
                        const exists = prev.some((d) => d.id === data.data.id);
                        if (exists) return prev;
                        return [data.data, ...prev];
                    });
                }

                // Actualización de estado de entrega
                if (data.type === 'delivery.status' || data.type === 'delivery_status') {
                    setDeliveries((prev) => {
                        // Si el estado es final (delivered o paid), remover de la lista
                        if (data.data.status === 'delivered' || data.data.status === 'paid') {
                            return prev.filter((d) => d.id !== data.data.id);
                        }
                        
                        // Actualizar el delivery existente
                        return prev.map((d) =>
                            d.id === data.data.id ? { ...d, ...data.data } : d
                        );
                    });
                }

                // Manejar cancelación de domicilio
                if (data.type === 'delivery_cancelled') {
                    setDeliveries((prev) => prev.filter((d) => d.id !== data.data.id));
                }
            } catch (err) {
            }
        };

        wsRef.current.onerror = (err) => {};

        wsRef.current.onclose = (ev) => {};

        return () => {
            wsRef.current?.close();
        };
    }, [urlWS]);

    return {
        deliveries,
        send: (obj: any) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify(obj));
            }
        }
    };
}
