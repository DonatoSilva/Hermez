import { Icon } from "@iconify-icon/react";
import { useCallback, useEffect, useState } from "react";
import {
  typeAddress,
  type AddressItemProps,
} from "src/types/Address/AddressProps";

export default function AddressItem({
  type,
  name = "",
  address = "",
  addressId = "",
  isFavorite = false,
  handleFavorite,
  handleDelete,
  handleEdit
}: AddressItemProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  // Función para editar la dirección
  const onEdit = useCallback(() => {
    handleEdit?.(addressId);
  }, [handleEdit]);

  // Función para eliminar la dirección
  const onDelete = useCallback(() => {
    handleDelete?.(addressId);
  }, [handleDelete]);

  // Función para marcar como favorita la dirección
  const onFavorite = useCallback(() => {
    // Aquí puedes actualizar el estado de favorita
    setFavorite((prev) => !prev);
    handleFavorite?.(addressId);
  }, [handleFavorite]);

  return (
    <div className="w-full max-w-full rounded-lg bg-linear-to-r from-H-blue-900 to-H-blue-700 relative px-4 py-3 flex items-center justify-between transition-all duration-200 overflow-hidden">
      <div className="flex-1">
        <h4 className="text-sm text-white">{name}</h4>
        <p className="text-xl text-white font-semibold">{address}</p>
      </div>

      <nav
        aria-label="acciones"
        className="flex flex-col items-center gap-2 ml-4 z-10"
      >
        <button
          onClick={onEdit}
          className="w-9 h-9 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition cursor-pointer"
          title="Editar"
        >
          <Icon icon="iconamoon:edit-fill" width="24" height="24" />
        </button>
        <button
          onClick={onDelete}
          className="w-9 h-9 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition cursor-pointer group"
          title="Eliminar"
        >
          <Icon icon="iconamoon:trash-simple-fill" width="24" height="24" className="group-hover:text-red-600 transition" />
        </button>
        <button
          onClick={onFavorite}
          className="w-9 h-9 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title="Favorito"
        >
          <Icon
            icon={isHovered || favorite ? "iconamoon:heart-fill" : "iconamoon:heart"}
            width={isHovered ? "24" : "20"}
            height={isHovered ? "24" : "20"}
            className={`transition duration-200 ${isHovered || favorite ? "text-red-600 group-hover:animate-pulse" : "text-white"}`}
          />
        </button>
      </nav>
      <img
        src={typeAddress[type].url}
        alt={typeAddress[type].alt}
        className="absolute -bottom-12 right-0 w-4/12 max-w-48 object-cover blur-xs"
      />
    </div>
  );
}
