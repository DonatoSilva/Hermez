import React, { Children, useEffect, useRef, useState } from 'react';
import { isOpen as statusOpenModal } from 'src/stores/DeliverySelectStore';
import styles from '../assets/styles/index.module.css'

const DeliveryDetails: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
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

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            unsubscribe()
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    useEffect(() => {
        statusOpenModal.set(isOpen)
    }, [isOpen])

    const handleClose: () => void = () => {
        setIsOpen(false)
    }

    return (
        <dialog
            ref={dialogRef}
            className={`fixed top-auto mx-auto w-full max-w-7xl h-[80vh] max-h-[850px] rounded-t-3xl bg-H-blue-100 dark:bg-H-black dark:text-H-blue-100 p-6 z-10 ${styles.dialog}`}
        >
            <div className="mx-auto w-full max-w-[1224px] h-full flex flex-col gap-4">
                <div className='w-full max-w-52 h-2 bg-gray-300 dark:bg-H-blue-900 rounded-full mx-auto transition-colors duration-200 cursor-pointer'></div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 dark:bg-gray-800 hover:bg-H-blue-300 rounded-full border-2 border-transparent hover:border-H-blue-300 cursor-pointer transition-all"
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
                {children}
            </div>
        </dialog>
    );
};

export default DeliveryDetails;
