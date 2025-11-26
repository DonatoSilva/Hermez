import { useQuotesByUser } from './hooks/useQuotesByUser';

type SolicitudesSectionProps = {
    token: string;
    userId: string;
    protocol?: string;
    host?: string;
};

export function SolicitudesSection({ token, userId, protocol, host }: SolicitudesSectionProps) {
    const { quotes, isLoading, error } = useQuotesByUser({ token, userId, protocol, host });

    console.log(quotes);

    // Skeleton de carga
    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-3">
                {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                        <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                        </div>
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

    // Sin solicitudes
    if (quotes.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    No hay ninguna solicitud
                </p>
            </div>
        );
    }

    // Mostrar solicitudes
    return (
        <div className="w-full flex flex-col gap-3">
            {quotes.map((quote) => (
                <div
                    key={quote.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-H-blue-100 dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                        window.location.href = `/solicitude/${quote.id}`;
                    }}
                >
                    <div className="flex-1">
                        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            ${Number(quote.client_price).toLocaleString('es-CO')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {quote.pickup_address} ➝ {quote.delivery_address}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                            {quote.offers?.length || 0} ofertas
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
