import { withState } from '@astrojs/react/actions';
import { actions } from 'astro:actions';
import { startTransition, useActionState, useEffect, useState } from "react";
import { SolarPointOnMapBoldDuotone } from 'src/icons/SolarPointOnMapBoldDuotone';
import type { AddressItemProps } from "src/types/Address/AddressProps";
import AddressItem from "./AddressItem";

const SkeletonAddresses = () => (
    <div className="flex flex-col w-full gap-10">
        <div className="flex flex-row mx-auto items-center gap-2 py-12">
            <SolarPointOnMapBoldDuotone className="animate-pulse" width="80" height="80" />
            <div className="flex flex-col gap-2">
                <h5 className="text-xl font-semibold text-neutral-700 dark:text-neutral-200">Cargando direcciones</h5>
                <p className="text-base text-neutral-500 dark:text-neutral-400">Buscando en nuestro servidor...</p>
            </div>
        </div>
    </div>
);

/**
 * Componente para mostrar las direcciones guardadas de un usuario.
 * @param className - Clase CSS opcional para personalizar el estilo.
 * @param title - Título que se mostrará encima de las direcciones.
 * @param children - Elemento que se mostrará cuando no haya direcciones guardadas.
 * @returns JSX.Element
 */
export default function ContentAddresses({ emptyFavorite, emptyPoints }: { className?: string, emptyFavorite?: React.JSX.Element, emptyPoints?: React.JSX.Element }) {
    const [addresses, setAddresses] = useState<AddressItemProps[]>([]);
    const [favorites, setFavorites] = useState<AddressItemProps[]>([]);
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
            setAddresses(reqGet.data);
            setFavorites(reqGet.data.filter((address: AddressItemProps) => address.isFavorite));
        }
    }, [reqGet, pendingGet]);



    const handleFavorite = (id: string) => {

    }

    const handleDelete = (id: string) => {

    }

    const handleEdit = (id: string) => {

    }

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
        <div className="flex flex-col w-full lg:flex-row gap-10">
            <article className={'w-full flex flex-col gap-4'}>
                <h6 className="text-sm dark:text-white">Direcciones guardadas</h6>
                <div className="flex flex-col gap-4">
                    {
                        addresses?.length > 0 ? addresses.map((address) => (
                            <AddressItem key={address.id} {...address} handleDelete={handleDelete} handleEdit={handleEdit} handleFavorite={handleFavorite} />
                        )) : emptyPoints
                    }
                </div>
            </article>
            {
                addresses?.length > 0 && (
                    <article className={'w-full flex flex-col gap-4'}>
                        <h6 className="text-sm dark:text-white">Favoritas</h6>
                        <div className="flex flex-col gap-4">
                            {
                                favorites.length > 0 ? favorites.map((address) => (
                                    <AddressItem key={address.id} {...address} handleDelete={handleDelete} handleEdit={handleEdit} handleFavorite={handleFavorite} />
                                )) : emptyFavorite
                            }
                        </div>
                    </article>
                )
            }
        </div>
    )
}
