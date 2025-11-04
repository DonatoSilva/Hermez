import { useState } from "react";
import {
  typeAddress,
  type AddressItemProps,
} from "src/types/Address/AddressProps";

export default function AddressItem({
  type,
  name = "",
  address = "",
  id = "",
  hasFavorite = false
}: AddressItemProps) {
  const [isFavorite, setIsFavorite] = useState(hasFavorite);
  // Función para editar la dirección
  const onEdit = () => {
    // Aquí puedes abrir un modal o navegar a la pantalla de edición
    console.log(`Editar dirección con id: ${id}`);
  };

  // Función para eliminar la dirección
  const onDelete = () => {
    // Aquí puedes mostrar una confirmación y luego eliminar la dirección
    console.log(`Eliminar dirección con id: ${id}`);
  };

  // Función para marcar como favorita la dirección
  const onFavorite = () => {
    // Aquí puedes actualizar el estado de favorita
    setIsFavorite(!isFavorite);
  };

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
          <img src="/icons/edit-icon.svg" alt="Editar" className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="w-9 h-9 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition cursor-pointer"
          title="Eliminar"
        >
          <img src="/icons/trash-icon.svg" alt="Eliminar" className="w-5 h-5" />
        </button>
        <button
          onClick={onFavorite}
          className="w-9 h-9 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition cursor-pointer"
          title="Favorito"
        >
          <svg
            className={`w-5 h-5 ${!isFavorite ? "text-white" : "text-red-600"}`}
            fill={!isFavorite ? "none" : "currentColor"}
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
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
