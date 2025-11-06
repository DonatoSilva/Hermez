import { useStore } from '@nanostores/react';
import React, { useEffect, useRef } from 'react';
import { changeStatusModal, getStatusModal, statusModal } from 'src/stores/ModalStore';
import styles from './styles/index.module.css';

const Modal: React.FC<{ title: string; keyModal: string; children: React.ReactNode }> = ({ title, keyModal = crypto.randomUUID(), children }) => {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const modal = useStore(statusModal)

    const handleClose: () => void = (event?: MouseEvent) => {
        if (event?.target === dialogRef.current) {
            changeStatusModal(keyModal as never, {
                ...getStatusModal(keyModal as never),
                isOpen: false
            } as never)
            return
        }
    }

    useEffect(() => {
        if (!modal[keyModal]) {
            changeStatusModal(keyModal as never, {
                ...getStatusModal(keyModal as never),
                isOpen: false
            } as never)
            return
        }

        if (!modal[keyModal]?.isOpen) {
            dialogRef.current?.close()
        } else {
            dialogRef.current?.showModal()
        }
    }, [modal[keyModal]])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        dialogRef.current?.addEventListener('click', handleClose)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            dialogRef.current?.removeEventListener('click', handleClose)
        }
    }, [])

    return (
        <dialog
            ref={dialogRef}
            className={`fixed top-auto mx-auto w-full max-w-7xl h-[80vh] max-h-[850px] rounded-t-3xl bg-H-blue-100 dark:bg-H-black dark:text-H-blue-100 z-10 ${styles.dialog} cursor-pointer`}
        >
            <div className={`p-6 cursor-default`}>
                <div className="mx-auto w-full max-w-[1224px] h-full flex flex-col gap-4">
                    <div className='w-full max-w-52 h-2 bg-gray-300 dark:bg-H-blue-900 rounded-full mx-auto transition-colors duration-200 cursor-pointer'></div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">{modal[keyModal]?.metaData?.title as string || title}</h2>
                        <button
                            onClick={() => {
                                changeStatusModal(keyModal as never, {
                                    ...getStatusModal(keyModal as never),
                                    isOpen: false
                                } as never)
                            }}
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
            </div>
        </dialog>
    );
};

export default Modal;
