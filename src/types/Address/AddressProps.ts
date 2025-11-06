export const typeAddress = {
    casa: {
        url: "/images/tiposDeDirecciones/home.png",
        alt: "imagen representativa del tipo de direccion - Casa"
    },
    trabajo: {
        url: "/images/tiposDeDirecciones/work.webp",
        alt: "imagen representativa del tipo de direccion - Trabajo"
    },
    edificio: {
        url: "/images/tiposDeDirecciones/building.webp",
        alt: "imagen representativa del tipo de direccion - Edificio"
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
