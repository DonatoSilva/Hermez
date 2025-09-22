import React from 'react'
import { MessageOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';

const BodyDetails = () => {
    return (
        <div className='w-full h-full flex flex-col lg:flex-row gap-8 dark:text-white text-H-black'>
            <div className='flex-1 flex flex-col gap-8'>
                <div className='flex justify-between items-start'>
                    <span className='bg-amber-500 text-white px-2 py-0.5 rounded-md'>En espera</span >
                    <div className='flex flex-col items-end'>
                        <p className='text-sm'>Tiempo de entrega</p>
                        <b>10min</b>
                    </div>
                </div>
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6'>
                    <div className='flex items-center justify-between mb-6'>
                        <div className='flex items-center gap-4'>
                            <img
                                src="/images/domiciliarioConCajas-min.webp"
                                className='size-12 rounded-full border-2 border-H-blue-700'
                                alt="Delivery person profile"
                            />
                            <div>
                                <p className='text-lg font-bold'>Jesus Manuel Cardenas</p>
                                <div className="flex items-center gap-2">
                                    <div className="">
                                        <span className="text-yellow-500">★</span>
                                        <b className='ml-1 text-sm'>4.7</b>
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        127 viajes completados
                                    </span>
                                </div>
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

                    <div className="p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                                <span className="font-medium">AKT - CR4 162</span>
                            </div>
                            <span className='bg-H-blue-700 text-white px-3 py-1 rounded-md text-sm font-bold'>
                                DON 58F
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors"
                            onClick={() => window.open('tel:+123456789')}
                        >
                            <PhoneOutlined className="text-xl" />
                            <span className="font-medium">Llamar</span>
                        </button>
                        <button
                            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg transition-colors"
                            onClick={() => window.open('sms:+123456789')}
                        >
                            <MessageOutlined className="text-xl" />
                            <span className="font-medium">Escribir</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className='lg:w-2/5 flex flex-col gap-8'>
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
                                <p className="font-medium">Calle 123 #45-67, Barrio Example</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-200">Destino</p>
                                <p className="font-medium">Carrera 89 #12-34, Barrio Sample</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">Tipo de Envío</h3>
                        <div className="flex items-center gap-2">
                            <span className="bg-H-blue-700 text-white px-3 py-1 rounded-full text-sm">
                                Paquetes
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                • Entrega estándar
                            </span>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <img
                            src="/images/tiposEnvio/paquete-min.png"
                            alt="Tipo de envío"
                            className="w-16 h-16 object-contain"
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className='text-lg font-semibold '>Observaciones</h4>
                    <div className='flex items-center justify-between w-full'>
                        <div className="flex items-center gap-2 w-full">
                            <span className="text-gray-500 dark:text-gray-400">Sin observaciones</span>
                        </div>
                        <button
                            className="flex items-center bg-H-blue-900 p-3 text-white dark:text-H-blue-500 dark:hover:text-H-blue-400 transition-colors rounded-md cursor-pointer"
                        >
                            <PlusOutlined />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BodyDetails