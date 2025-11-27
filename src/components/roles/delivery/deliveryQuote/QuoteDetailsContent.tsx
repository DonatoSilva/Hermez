import { Icon } from '@iconify-icon/react';
import React from 'react';

interface QuoteDetailsContentProps {
    quote: any;
}

const QuoteDetailsContent: React.FC<QuoteDetailsContentProps> = ({ quote }) => {
    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: string) => {
        return `$${Number(price).toLocaleString('es-CO')}`;
    };

    return (
        <div className="flex flex-col gap-6 max-h-[600px] overflow-y-auto">
            {/* Cliente */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Icon icon="solar:user-bold-duotone" width={24} height={24} />
                    Cliente
                </h3>
                <div className="flex items-center gap-4">
                    <img
                        src={quote.client.image_url || '/images/domiciliarioConCajas-min.webp'}
                        alt={quote.client.username}
                        className="w-16 h-16 rounded-full border-2 border-H-blue-300"
                    />
                    <div>
                        <p className="font-semibold">{quote.client.first_name} {quote.client.last_name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">@{quote.client.username}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{quote.client.phone}</p>
                    </div>
                </div>
            </div>

            {/* Direcciones */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Icon icon="solar:map-point-bold-duotone" width={24} height={24} />
                    Direcciones
                </h3>
                <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <div className="bg-green-500 rounded-full p-2 mt-1">
                            <Icon icon="mdi:map-marker" width={20} height={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Recoger en</p>
                            <p className="font-medium">{quote.pickup_address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="bg-red-500 rounded-full p-2 mt-1">
                            <Icon icon="mdi:map-marker-check" width={20} height={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Entregar en</p>
                            <p className="font-medium">{quote.delivery_address}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detalles del  Pedido */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Icon icon="solar:box-bold-duotone" width={24} height={24} />
                    Detalles del Pedido
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Categoría</p>
                        <p className="font-medium">{quote.category}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Método de pago</p>
                        <p className="font-medium capitalize">{quote.payment_method}</p>
                    </div>
                    {quote.estimated_weight && (
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Peso estimado</p>
                            <p className="font-medium">{quote.estimated_weight} kg</p>
                        </div>
                    )}
                    {quote.estimated_size && (
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tamaño estimado</p>
                            <p className="font-medium">{quote.estimated_size}</p>
                        </div>
                    )}
                </div>
                {quote.description && (
                    <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Descripción</p>
                        <p className="text-sm">{quote.description}</p>
                    </div>
                )}
            </div>

            {/* Observaciones */}
            {quote.observations && quote.observations.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Icon icon="solar:notes-bold-duotone" width={24} height={24} />
                        Observaciones
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                        {quote.observations.map((obs: string, index: number) => (
                            <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{obs}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Precio y Vencimiento */}
            <div className="bg-H-blue-900 text-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Precio del cliente</span>
                    <span className="text-2xl font-bold">{formatPrice(quote.client_price)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Vence el</span>
                    <span>{formatDate(quote.expires_at)}</span>
                </div>
            </div>
        </div>
    );
};

export default QuoteDetailsContent;
