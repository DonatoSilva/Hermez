export const typeAddress = {
    casa: {
        url: "/images/tiposDeDirecciones/home.png",
        alt: "imagen representativa del tipo de direccion - Casa",
        bgColor: "bg-H-blue-100 dark:bg-H-blue-900",
        iconColor: "text-H-blue-600 dark:text-H-blue-400",
    },
    trabajo: {
        url: "/images/tiposDeDirecciones/work.webp",
        alt: "imagen representativa del tipo de direccion - Trabajo",
        bgColor: "bg-orange-100 dark:bg-orange-900",
        iconColor: "text-orange-600 dark:text-orange-400",
    },
    edificio: {
        url: "/images/tiposDeDirecciones/building.webp",
        alt: "imagen representativa del tipo de direccion - Edificio",
        bgColor: "bg-yellow-100 dark:bg-yellow-900",
        iconColor: "text-yellow-600 dark:text-yellow-400",
    },
};

export type AddressItemProps = {
    addressId: string;
    userId: string;
    type: keyof typeof typeAddress;
    name: string;
    description?: string;
    address: string;
    city: string;
    isFavorite?: boolean;
    handleFavorite?: (id: string) => void;
    handleDelete?: (id: string) => void;
    handleEdit?: (id: string) => void;
};
