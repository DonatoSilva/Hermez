export const typeAddress = {
    home: {
        url: "/images/tiposDeDirecciones/home.png",
        alt: "imagen representativa del tipo de direccion - Casa"
    },
    work: {
        url: "/images/tiposDeDirecciones/work.webp",
        alt: "imagen representativa del tipo de direccion - Trabajo"
    },
    building: {
        url: "/images/tiposDeDirecciones/building.webp",
        alt: "imagen representativa del tipo de direccion - Edificio"
    },
};

export type AddressItemProps = {
    type: keyof typeof typeAddress;
    name: string;
    address: string;
    id: string;
    isFavorite?: boolean;
    handleFavorite?: (id: string) => void;
    handleDelete?: (id: string) => void;
    handleEdit?: (id: string) => void;
};
