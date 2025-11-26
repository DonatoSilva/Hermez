// Hook para conexión WebSocket de estadísticas del delivery person
import { URL_LOCAL_BACKEND } from 'astro:env/client';
import { useEffect, useRef, useState } from 'react';

interface Delivery {
  id: string;
  client: any;
  delivery_person: any;
  final_price: string;
  status: string;
  [key: string]: any;
}

interface PersonStats {
  type: string;
  deliveries: Delivery[];
  total: string;
  count: number;
}

interface UsePersonStatsProps {
  token?: string;
  personId?: string;
}

export function usePersonStats({ token, personId }: UsePersonStatsProps) {
  const [stats, setStats] = useState<PersonStats | null>(null);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const protocolWS = 'ws';

  const url = `${protocolWS}://${URL_LOCAL_BACKEND.split("/").pop()}/ws/deliveries/person/${personId}/stats/`;

  if (!token) {
    throw new Error('Token is required for WebSocket connection');
  }

  if (!personId) {
    throw new Error('Person ID is required for WebSocket connection');
  }

  useEffect(() => {
    wsRef.current = new WebSocket(url, [token]);

    wsRef.current.onopen = () => {
      setLoading(false);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'person_stats') {
          setStats(data);
        }

        if (data.type === 'stats_updated') {
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    wsRef.current.onerror = (err) => {
      setLoading(false);
    };

    wsRef.current.onclose = (ev) => {
      setLoading(false);
    };

    return () => {
      wsRef.current?.close();
    };
  }, [url, token]);

  return {
    stats,
    loading,
    send: (obj: any) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(obj));
      }
    }
  };
}
