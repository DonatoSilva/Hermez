import React from "react";
import {
  typeAddress,
  type AddressItemProps,
} from "src/types/Address/AddressProps";

export default function AddressItem({
  type,
  name = "",
  address = "",
  id = "",
}: AddressItemProps) {
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
    console.log(`Marcar como favorita la dirección con id: ${id}`);
  };

  return (
    <article className="w-full max-w-full rounded-lg overflow-hidden from-H-blue-900 to-H-blue-700 relative px-4 py-3 flex items-center justify-between transition-all duration-200">
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
          <img src="/icons/heart-icon.svg" alt="Favorito" className="w-5 h-5" />
        </button>
      </nav>
      <img
        src={typeAddress[type].url}
        alt={typeAddress[type].alt}
        className="absolute -bottom-12 right-0 w-4/12 max-w-48 object-cover blur-xs"
      />
    </article>
  );
}
