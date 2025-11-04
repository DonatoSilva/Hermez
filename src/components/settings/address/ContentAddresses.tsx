import { useEffect, useState } from "react";
import type { AddressItemProps } from "src/types/Address/AddressProps";
import AddressItem from "./AddressItem";

/**
 * Componente para mostrar las direcciones guardadas de un usuario.
 * @param className - Clase CSS opcional para personalizar el estilo.
 * @param title - Título que se mostrará encima de las direcciones.
 * @param children - Elemento que se mostrará cuando no haya direcciones guardadas.
 * @returns JSX.Element
 */
export default function ContentAddresses({ className = "", title, isFavorite = false, children }: { className?: string, title: string, isFavorite?: boolean, children: React.JSX.Element }) {
    const [addresses, setAddresses] = useState<AddressItemProps[] | undefined>([]);

    useEffect(() => {

    }, []);

    if (addresses === undefined) {
        return (
            <article className={`w-full flex flex-col gap-4 ${className}`}>
                <h6 className="text-sm dark:text-white">{title}</h6>
                <div className="flex items-center justify-center py-8">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Loading addresses...</span>
                </div>
            </article>
        );
    }

    return (
        <article className={`w-full flex flex-col gap-4 ${className}`}>
            <h6 className="text-sm dark:text-white">{title}</h6>
            <div className="flex flex-col gap-4">
                {
                    addresses.length > 0 ? addresses.map((address) => (
                        <AddressItem key={address.id} {...address} />
                    )) : children
                }
            </div>
        </article>
    )
}
