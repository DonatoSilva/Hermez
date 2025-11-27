import HistoryItem from '@components/history/historyItem/HistoryItem';
import { useDeliveriesByUser } from './hooks/useDeliveriesByUser';

type DomiciliosSectionProps = {
    token: string;
    userId: string;
    protocol?: string;
    host?: string;
};

export function DomiciliosSection({ token, userId, protocol, host }: DomiciliosSectionProps) {
    const { deliveries, isLoading, error } = useDeliveriesByUser({ token, userId, protocol, host });

    // Skeleton de carga
    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                        <div className="h-16 w-16 bg-gray-300 dark:bg-gray-600 rounded-md" />
                        <div className="flex-1 space-y-2">
                            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/4" />
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                        </div>
                        <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    // Mensaje de error
    if (error) {
        return (
            <div className="w-full flex items-center justify-center py-8">
                <div className="text-center">
                    <p className="text-red-500 dark:text-red-400 font-medium mb-2">⚠️ Error de conexión</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    // Sin domicilios en proceso
    if (deliveries.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    Que triste no tienes ningun domicilio en camino en este instante
                </p>
            </div>
        );
    }

    // Mostrar domicilios en proceso usando HistoryItem
    return (
        <div className="w-full flex flex-col gap-3">
            {deliveries.map((delivery) => (
                <HistoryItem
                    isDriver={false}
                    key={delivery.id}
                    id={delivery.id}
                    type={delivery.delivery_type || 'paquetes'}
                    price={delivery.final_price || delivery.client_price}
                    address={`${delivery.pickup_address || ''} ➝ ${delivery.delivery_address || ''}`}
                    status={delivery.status}
                />
            ))}
        </div>
    );
}
