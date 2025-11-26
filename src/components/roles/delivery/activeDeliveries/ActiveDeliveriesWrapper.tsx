import { statusColors } from "@components/history/historyItem/HistoryItem";
import { Icon } from "@iconify-icon/react";
import { toastStore } from "@stores/StoreToast";
import { isAvailable as isAvailableStore } from "@stores/UserStore";
import { actions } from "astro:actions";
import { useEffect, type ReactNode } from "react";
import type { Delivery } from "./hooks/useDriverDeliveries";
import { useDriverDeliveries } from "./hooks/useDriverDeliveries";

type ActiveDeliveriesWrapperProps = {
  token: string;
  userId: string;
  protocol?: string;
  host?: string;
  children: ReactNode;
};

const STATUS_FLOW = {
  assigned: { next: 'picked_up', label: 'Recoger pedido', icon: 'mdi:package-check' },
  picked_up: { next: 'in_transit', label: 'En camino', icon: 'mdi:truck-fast' },
  in_transit: { next: 'delivered', label: 'Entregado', icon: 'mdi:check-circle' },
} as const;

export function ActiveDeliveriesWrapper({
  token,
  userId,
  protocol,
  host,
  children,
}: ActiveDeliveriesWrapperProps) {
  const { deliveries } = useDriverDeliveries({ token, userId, protocol, host });

  // Cuando hay entregas asignadas, cambiar a "Ocupado"
  useEffect(() => {
    if (deliveries.length > 0) {
      isAvailableStore.set(false);
      
      // Actualizar el estado en el servidor
      actions.User.toggleAvailability({}).then(({ data, error }) => {
        if (error) {
          console.error('Error al cambiar estado a ocupado:', error);
        }
        
        if (data) {
          const availabilityStatus = document.getElementById('availabilityStatus');
          if (availabilityStatus) {
            availabilityStatus.textContent = data.is_available ? 'Disponible' : 'Ocupado';
          }
        }
      });
    }
  }, [deliveries.length]);

  const handleNextStatus = async (deliveryId: string) => {
    const { data, error } = await actions.Delivery.updateDeliveryStatus({ deliveryId });

    if (error) {
      toastStore.set({
        title: 'Error al actualizar estado',
        message: error.message,
        type: 'error',
        emoji: '❌',
        visible: true,
        autoClose: true,
        autoCloseDelay: 2500,
      });
      return;
    }

    if (data) {
      toastStore.set({
        title: 'Estado actualizado',
        message: `Entrega marcada como: ${nextStatusInfo.label}`,
        type: 'success',
        emoji: '✅',
        visible: true,
        autoClose: true,
        autoCloseDelay: 2500,
      });
    }
  };

  const formatPrice = (price: string) => {
    return `$${Number(price).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatus = (status: Delivery['status']) => {
    const {color, label} = statusColors[status]

    return {color, label}
  };

  // Si no hay entregas, mostrar el children (Banner con mensaje de espera)
  if (deliveries.length === 0) {
    return <>{children}</>;
  }

  // Si hay entregas, mostrar la primera entrega activa
  const currentDelivery = deliveries[0];
  const nextStatusInfo = STATUS_FLOW[currentDelivery.status as keyof typeof STATUS_FLOW];

  return (
    <div className="w-full mx-auto px-4 py-6">
      <div className="bg-white dark:bg-slate-800 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-linear-to-r from-H-blue-500 to-H-blue-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Icon icon="mdi:motorbike" width={32} height={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Entrega Activa</h2>
                <p className="text-white/80 text-sm">ID: {currentDelivery.id.slice(0, 8)}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatus(currentDelivery.status).color}`}>
              {getStatus(currentDelivery.status).label}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Cliente */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <img
              src={currentDelivery.client.image_url || '/images/default-avatar.png'}
              alt={currentDelivery.client.first_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-H-blue-300"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentDelivery.client.first_name} {currentDelivery.client.last_name}
              </h3>
              {currentDelivery.client.username && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{currentDelivery.client.username}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-H-blue-600 dark:text-H-blue-400">
                {formatPrice(currentDelivery.final_price)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(currentDelivery.created_at)}
              </p>
            </div>
          </div>

          {/* Direcciones */}
          <div className="grid gap-4">
            {/* Dirección de recogida */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full p-2 mt-1">
                  <Icon icon="mdi:map-marker" width={20} height={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Recoger en
                  </p>
                  <p className="text-base text-gray-900 dark:text-white font-medium">
                    {currentDelivery.pickup_address}
                  </p>
                </div>
              </div>
            </div>

            {/* Dirección de entrega */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-500 rounded-full p-2 mt-1">
                  <Icon icon="mdi:map-marker-check" width={20} height={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Entregar en
                  </p>
                  <p className="text-base text-gray-900 dark:text-white font-medium">
                    {currentDelivery.delivery_address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de acción */}
          {nextStatusInfo && (
            <button
              type="button"
              onClick={() => handleNextStatus(currentDelivery.id)}
              className="w-full bg-H-blue-500 hover:bg-H-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
              <Icon icon={nextStatusInfo.icon} width={24} height={24} />
              <span className="text-lg">{nextStatusInfo.label}</span>
            </button>
          )}

          {/* Indicador de más entregas en cola */}
          {deliveries.length > 1 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                <Icon icon="mdi:information" className="inline mr-1" width={16} height={16} />
                Tienes {deliveries.length - 1} entrega{deliveries.length - 1 > 1 ? 's' : ''} más en cola
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
