import { withState } from '@astrojs/react/actions';
import { useStore } from '@nanostores/react';
import { actions } from 'astro:actions';
import { startTransition, useActionState, useCallback, useEffect, useState } from "react";
import { allAddresses as $allAddresses, favorites as $favorites, addressToEdit } from 'src/stores/AddressStore';
import { changeStatusModal, getStatusModal } from 'src/stores/ModalStore';
import { toastStore } from 'src/stores/StoreToast';
import AddressItem from "./AddressItem";
import AddressItemSkeleton from "./AddressItemSkeleton";

const SkeletonAddresses = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full grid-flow-row">
        {Array.from({ length: 3 }).map((_, index) => (
            <AddressItemSkeleton key={index} />
        ))}
    </div>
);

/**
 * Componente para mostrar las direcciones guardadas de un usuario.
 * @param className - Clase CSS opcional para personalizar el estilo.
 * @param title - Título que se mostrará encima de las direcciones.
 * @param children - Elemento que se mostrará cuando no haya direcciones guardadas.
 * @returns JSX.Element
 */
export default function ContentAddresses({ emptyFavorite, emptyPoints }: { emptyFavorite?: React.JSX.Element, emptyPoints?: React.JSX.Element }) {
    const addresses = useStore($allAddresses);
    const favorites = useStore($favorites);

    const [initload, setInitload] = useState(true);
    const [reqGet, getAddresses, pendingGet = true] = useActionState(
        withState(actions.User.Address.get),
        { data: [], error: undefined }
    )

    useEffect(() => {
        startTransition(() => {
            getAddresses(new FormData());
        })
    }, []);

    useEffect(() => {
        if (!pendingGet && initload) {
            setInitload(false);
        }

        if (reqGet?.data) {
            $allAddresses.set(reqGet.data);
        }
    }, [reqGet, pendingGet]);



    const handleFavorite = useCallback(async (id: string) => {
        const prevAddresses = $allAddresses.get();
        const toggled = prevAddresses.map(a => a.addressId === id ? { ...a, isFavorite: !a.isFavorite } : a);
        try {
            const form = new FormData();
            form.set('addressId', id);
            $allAddresses.set(toggled);
            const { data, error } = await actions.User.Address.favorite(form);

            if (error) {
                // revert optimist update
                $allAddresses.set(prevAddresses);
                toastStore.set({
                    visible: true,
                    message: error.message,
                    type: 'error',
                    autoClose: true,
                    autoCloseDelay: 3000,
                });
                return;
            }

            toastStore.set({
                visible: true,
                message: data?.message || 'Dirección marcada como favorita',
                type: data?.isFavorite ? 'success' : 'info',
                emoji: data?.isFavorite ? '⭐' : '😥',
                autoClose: true,
                autoCloseDelay: 3000,
            });
        } catch (err) {
            // revert optimist update
            $allAddresses.set(prevAddresses);
            toastStore.set({
                visible: true,
                message: 'Error inesperado al marcar favorita',
                type: 'error',
                autoClose: true,
                autoCloseDelay: 3000,
            });
        }
    }, []);

    const handleDelete = useCallback(async (id: string) => {
        const confirmed = window.confirm('¿Deseas eliminar esta dirección?');
        if (!confirmed) return;

        try {
            const form = new FormData();
            form.set('addressId', id);
            const { data, error } = await actions.User.Address.delete(form);

            if (error) {
                toastStore.set({
                    visible: true,
                    message: error.message,
                    type: 'error',
                    autoClose: true,
                    autoCloseDelay: 3000,
                });
                return;
            }

            $allAddresses.set(addresses.filter(a => a.addressId !== id));

            toastStore.set({
                visible: true,
                message: (data as any)?.message || 'Dirección eliminada con éxito',
                type: 'success',
                autoClose: true,
                autoCloseDelay: 3000,
            });
        } catch (err) {
            toastStore.set({
                visible: true,
                message: 'Error inesperado al eliminar la dirección',
                type: 'error',
                autoClose: true,
                autoCloseDelay: 3000,
            });
        }
    }, []);

    const handleEdit = useCallback((id: string) => {
        const address = addresses.find(a => a.addressId === id);
        if (address) {
            // reset previous edit
            addressToEdit.set(undefined);
            addressToEdit.set(address);
            changeStatusModal(
                "form-address" as never,
                {
                    ...getStatusModal("form-address" as never),
                    metaData: {
                        ...getStatusModal("form-address" as never).metaData,
                        title: "Editar dirección",
                    },
                    action: "edit",
                    isOpen: true,
                } as never
            );
        }
    }, [addresses]);

    if (pendingGet || initload) {
        return <SkeletonAddresses />
    }

    if (reqGet?.error) {
        return (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/30">
                <p className="font-medium">Ups, algo salió mal 😅</p>
                <p className="text-sm">No pudimos cargar tus direcciones. Intenta nuevamente más tarde.</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col w-full lg:flex-row gap-10">
                {
                    addresses?.length > 0 && (
                        <article className={'w-full flex flex-col gap-4'}>
                            <h6 className="text-sm dark:text-white">Favoritas</h6>
                            <div className="flex flex-col gap-4">
                                {
                                    favorites.length > 0 ? favorites.map((address) => (
                                        <AddressItem key={address.addressId + "-favorite"} {...address} handleDelete={handleDelete} handleEdit={handleEdit} handleFavorite={handleFavorite} />
                                    )) : emptyFavorite
                                }
                            </div>
                        </article>
                    )
                }
                <article className={'w-full flex flex-col gap-4'}>
                    <h6 className="text-sm dark:text-white">Direcciones guardadas</h6>
                    <div className="flex flex-col gap-4">
                        {
                            addresses?.length > 0 ? addresses.map((address) => (
                                address.isFavorite ? null : (
                                    <AddressItem key={address.addressId + "-all"} {...address} handleDelete={handleDelete} handleEdit={handleEdit} handleFavorite={handleFavorite} />
                                )
                            )) : emptyPoints
                        }
                    </div>
                </article>
            </div>
        </>
    )
}
