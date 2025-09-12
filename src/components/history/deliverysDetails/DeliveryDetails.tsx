import React, { useEffect, useRef, useState } from 'react';
import { isOpen as statusOpenModal } from 'src/stores/DeliverySelectStore';
import styles from '../assets/styles/index.module.css'

const DeliveryDetails: React.FC = () => {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const unsubscribe = statusOpenModal.subscribe((status) => {
            setIsOpen(status)
            if (status) {
                dialogRef.current?.showModal()
            } else {
                dialogRef.current?.close()
            }
        })
        return () => {
            unsubscribe()
        }
    }, [])

    useEffect(() => {
        statusOpenModal.set(isOpen)
    }, [isOpen])

    return (
        <dialog
            ref={dialogRef}
            className={` fixed top-auto mx-auto w-full max-w-7xl h-[80vh] max-h-[850px] rounded-t-3xl bg-white p-6 z-10 ${styles.dialog}`}
        >
            <div className="mx-auto w-full max-w-[1224px] h-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Detalles del domicilio</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full border-2 border-transparent hover:border-H-blue-300 cursor-pointer transition-all"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                {/* Content goes here */}
            </div>
        </dialog>
    );
};

export default DeliveryDetails;
