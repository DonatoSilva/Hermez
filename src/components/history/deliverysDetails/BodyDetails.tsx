import { CarOutlined, CheckCircleOutlined, ClockCircleOutlined, FileDoneOutlined, MessageOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { toastStore } from '@stores/StoreToast';
import { actions } from 'astro:actions';
import { useEffect, useRef, useState } from 'react';
import { changeStatusModal, getStatusModal } from 'src/stores/ModalStore';
import type { DeliveryResponse, HistoryItem } from 'src/types/Delivery/DeliveryProps';
import { typeVehicle } from 'src/types/Vehicle/VehicleProps';
import { statusColors } from '../historyItem/HistoryItem';
import styles from './styles/fill-Bar.module.css';

interface BodyDetailsProps {
    id: string;
}

const BodyDetails = ({ id }: BodyDetailsProps) => {
    const [isPressing, setIsPressing] = useState<boolean | undefined>(undefined)
    const timeoutId = useRef<NodeJS.Timeout | null>(null)
    const CANCEL_TIMER = 2000

    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [delivery, setDelivery] = useState<DeliveryResponse | null>(null)
    const componentRef = useRef<HTMLDivElement>(null)
    const hasLoadedRef = useRef<boolean>(false)

    useEffect(() => {
        const fetchDelivery = async () => {
            try {
                setLoading(true)
                const { data, error: errorDelivery } = await actions.Delivery.History.getDeliveryHistory({delivery_id: id})

                if (errorDelivery) {
                    setError(true)
                } else if (data) {
                    setDelivery(data as DeliveryResponse)
                }
            } catch (err) {
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        // Lazy loading: only fetch when component is visible
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasLoadedRef.current) {
                    hasLoadedRef.current = true
                    fetchDelivery()
                }
            },
            { threshold: 0.1 }
        )

        if (componentRef.current) {
            observer.observe(componentRef.current)
        }

        return () => {
            if (componentRef.current) {
                observer.unobserve(componentRef.current)
            }
        }
    }, [id])

    const onClose = () => {
        changeStatusModal(id as never, {
            ...getStatusModal(id as never),
            isOpen: false,
        } as never);
    }

    const handlePress = () => {
        setIsPressing(true)
        timeoutId.current = setTimeout(async () => {
            onClose()

            const { data, error: errorCancel } = await actions.Delivery.cancelDelivery({deliveryId: delivery?.delivery.id || ''})
            if (errorCancel) {
                setError(true)

                toastStore.set({
                    visible: true,
                    message: 'Error al cancelar el pedido',
                    type: 'error',
                    autoClose: true,
                    autoCloseDelay: 2500,
                })
            }

            toastStore.set({
                visible: true,
                message: 'Pedido cancelado correctamente',
                emoji: '🫢',
                type: 'success',
                autoClose: true,
                autoCloseDelay: 2500,
            })
            setIsPressing(false)

            timeoutId.current = null
        }, CANCEL_TIMER)
    }

    const handleRelease = () => {
        if (timeoutId.current) {
            setIsPressing(false)
            clearTimeout(timeoutId.current)
            timeoutId.current = null
        }
    }

    // Event type mappings for icons and colors
    const getEventIcon = (eventType: string) => {
        const iconMap: Record<string, { icon: any; color: string; bgColor: string }> = {
            'quote_created': { icon: FileDoneOutlined, color: 'text-blue-500', bgColor: 'bg-blue-100' },
            'offer_accepted': { icon: CheckCircleOutlined, color: 'text-green-500', bgColor: 'bg-green-100' },
            'status_changed': { icon: ClockCircleOutlined, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
            'assigned': { icon: UserOutlined, color: 'text-indigo-500', bgColor: 'bg-indigo-100' },
            'in_transit': { icon: CarOutlined, color: 'text-purple-500', bgColor: 'bg-purple-100' },
            'delivered': { icon: CheckCircleOutlined, color: 'text-emerald-500', bgColor: 'bg-emerald-100' },
        }
        return iconMap[eventType] || { icon: ClockCircleOutlined, color: 'text-gray-500', bgColor: 'bg-gray-100' }
    }

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleString('es-CO', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (error) {
        return <p className='text-red-400 text-center py-2'>Error al cargar los detalles del pedido. Por favor, inténtalo de nuevo.</p>
    }

    if (loading || !delivery) {
        return <div ref={componentRef} className='text-center py-8'><p>Cargando detalles...</p></div>
    }

    const { delivery: deliveryData, history } = delivery
    const deliveryPerson = deliveryData.delivery_person
    const currentStatus = statusColors[deliveryData.status as keyof typeof statusColors] || { label: 'En espera', color: 'bg-amber-500' }
    const {image, label} = typeVehicle[deliveryData.vehicle?.toLocaleLowerCase() as keyof typeof typeVehicle] || {image: "/images/domiciliarioConCajas-min.webp", label: ""}
    return (
        <div ref={componentRef} className='w-full h-full flex flex-col gap-8 dark:text-white text-H-black'>
            {/* Main Content - Full Width */}
            <div className='flex flex-col lg:flex-row lg:items-start gap-8'>
                {/* Left Column */}
                <div className='flex-1 flex flex-col gap-8 lg:pb-8'>
                    <div className='flex justify-between items-start'>
                        <span className={`${currentStatus.color} text-white px-2 py-0.5 rounded-md`}>{currentStatus.label}</span>
                        <div className='flex flex-col items-end'>
                            <p className='text-sm'>Creado</p>
                            <b>{new Date(deliveryData.created_at).toLocaleDateString('es-CO', { hour: '2-digit', minute: '2-digit' })}</b>
                        </div>
                    </div>
                    <div className='bg-white dark:bg-transparent rounded-lg p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <div className='flex items-center gap-4'>
                                <img
                                    src={deliveryPerson?.image_url || "/images/domiciliarioConCajas-min.webp"}
                                    className='size-12 rounded-full border-2 border-H-blue-700'
                                    alt="Delivery person profile"
                                />
                                <div>
                                    <p className='text-lg font-bold'>
                                        {deliveryPerson ? `${deliveryPerson.first_name} ${deliveryPerson.last_name}` : 'Sin asignar'}
                                    </p>
                                    {deliveryPerson && (
                                        <div className="flex items-center gap-2">
                                            <div className="">
                                                <span className="text-yellow-500">★</span>
                                                <b className='ml-1 text-sm'>4.7</b>
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                127 viajes completados
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='text-center'>
                                <img
                                    className='size-20 mx-auto'
                                    src="/images/tiposEnvio/moto-min.png"
                                    alt="Motorcycle icon"
                                />
                            </div>
                        </div>

                        {deliveryPerson?.current_vehicle && (
                            <div className="p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                                        <span className="font-medium">{deliveryPerson.current_vehicle.brand} - {deliveryPerson.current_vehicle.model}</span>
                                    </div>
                                    <span className='bg-H-blue-700 text-white px-3 py-1 rounded-md text-sm font-bold'>
                                        {deliveryPerson.current_vehicle.plate}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => window.open(`tel:${deliveryPerson?.phone || ''}`)}
                                disabled={!deliveryPerson}
                            >
                                <PhoneOutlined className="text-xl" />
                                <span className="font-medium">Llamar</span>
                            </button>
                            <button
                                className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => window.open(`sms:${deliveryPerson?.phone || ''}`)}
                                disabled={!deliveryPerson}
                            >
                                <MessageOutlined className="text-xl" />
                                <span className="font-medium">Escribir</span>
                            </button>
                        </div>
                    </div>
                    <div className='rounded-lg bg-H-blue-900 px-8 py-4 text-white cursor-crosshair hover:shadow-md shadow-gray-500 transition-shadow duration-500'>
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-H-blue-500"></div>
                                <div className="w-0.5 h-20 border-dashed border-l-2"></div>
                                <div className="w-3 h-3 rounded-full bg-H-blue-700"></div>
                            </div>
                            <div className="flex flex-col gap-4 flex-1 justify-between">
                                <div>
                                    <p className="text-sm text-gray-200">Origen</p>
                                    <p className="font-medium">{deliveryData.pickup_address}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-200">Destino</p>
                                    <p className="font-medium">{deliveryData.delivery_address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className='lg:w-2/5 flex flex-col gap-8'>
                    <div className="flex items-center gap-4 p-4 rounded-lg">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">Tipo de Envío</h3>
                            <div className="flex items-center gap-2">
                                <span className="bg-H-blue-700 text-white px-3 py-1 rounded-full text-sm">
                                    {deliveryData.category}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    • {deliveryData.estimated_size} ({deliveryData.estimated_weight} kg)
                                </span>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <img
                                src={image}
                                alt={`imagen ilustrativa de ${label}`}
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className='text-lg font-semibold '>Descripción</h4>
                        <div className='flex items-center justify-between w-full'>
                            <div className="flex items-center gap-2 w-full">
                                <span className="text-gray-500 dark:text-gray-400">
                                    {deliveryData.description || 'Sin descripción'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-H-blue-900 p-4 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-200">Detalles de Pago</h4>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Valor del domicilio</span>
                            <span className="text-xl font-bold">
                                ${new Intl.NumberFormat('es-CO').format(parseFloat(deliveryData.final_price))}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="cursor-pointer flex-1 bg-H-blue-900 hover:bg-H-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                            Cerrar
                        </button>
                       { deliveryData.status !== 'cancelled' && deliveryData.status !== 'paid' && deliveryData.status !== 'delivered' && <button onMouseDown={handlePress} onMouseUp={handleRelease} onMouseLeave={handleRelease} className={`relative overflow-hidden bg-transparent cursor-pointer flex-1 border-2 border-red-500 text-red-500 py-2 px-4 rounded-lg transition-all font-medium ${styles["animate-container"]} ${isPressing === true ? styles["animate-fill-bar"] : isPressing === false ? styles["animate-fill-bar-reverse"] : ''}`}>
                            Cancelar Domicilio
                        </button>}
                    </div>
                </div>
            </div>

            {/* History Timeline - Full Width at Bottom */}
            {history && history.length > 0 && (
                <div className='w-full'>
                    <h3 className="text-xl font-bold mb-4">Historial de Eventos</h3>
                    <div className="relative">
                        {history.map((event: HistoryItem, index: number) => {
                            const eventConfig = getEventIcon(event.event_type)
                            const Icon = eventConfig.icon
                            const isLast = index === history.length - 1

                            return (
                                <div key={event.id} className="relative flex gap-4 pb-8">
                                    {/* Timeline Line */}
                                    {!isLast && (
                                        <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-300 dark:bg-gray-600"></div>
                                    )}

                                    {/* Icon Circle */}
                                    <div className={`relative z-10 shrink-0 w-12 h-12 rounded-full ${eventConfig.bgColor} dark:bg-opacity-20 flex items-center justify-center`}>
                                        <Icon className={`text-xl ${eventConfig.color}`} />
                                    </div>

                                    {/* Event Content */}
                                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={event.changed_by.image_url || "/images/domiciliarioConCajas-min.webp"}
                                                    className="w-8 h-8 rounded-full border border-gray-300"
                                                    alt={`${event.changed_by.first_name} ${event.changed_by.last_name}`}
                                                />
                                                <div>
                                                    <p className="font-semibold text-sm">
                                                        {event.changed_by.first_name} {event.changed_by.last_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {event.changed_by.role === 'client' ? 'Cliente' : event.changed_by.role === 'delivery' ? 'Domiciliario' : 'Usuario'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatTimestamp(event.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {event.description}
                                        </p>
                                        {event.quote && (
                                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                                <span className="font-semibold">Precio de cotización: </span>
                                                ${new Intl.NumberFormat('es-CO').format(parseFloat(event.quote.client_price))}
                                            </div>
                                        )}
                                        {event.delivery && (
                                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                                <span className="font-semibold">Precio final: </span>
                                                ${new Intl.NumberFormat('es-CO').format(parseFloat(event.delivery.final_price))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default BodyDetails
