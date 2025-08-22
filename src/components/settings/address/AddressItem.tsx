import React from "react";

export type AddressItemProps = {
  name?: string;
  address?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onFavorite?: () => void;
};

export default function AddressItem({
  name = "Mi Hogar",
  address = "Carrera 8 # 10 - 32",
  onEdit,
  onDelete,
  onFavorite,
}: AddressItemProps) {
  return (
    <article className="w-full max-w-full rounded-lg overflow-hidden bg-gradient-to-r from-[#2b4055] to-[#496e93cc] relative px-4 py-3 flex items-center justify-between">
      <div className="flex-1">
        <h4 className="text-sm text-white">{name}</h4>
        <p className="text-lg text-white font-semibold">{address}</p>
      </div>

      <nav
        aria-label="acciones"
        className="flex flex-col items-center gap-2 ml-4"
      >
        <button
          onClick={onEdit}
          className="w-9 h-9 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition"
          title="Editar"
        >
          <img src="/icons/edit-icon.svg" alt="Editar" className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="w-9 h-9 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition"
          title="Eliminar"
        >
          <img src="/icons/trash-icon.svg" alt="Eliminar" className="w-5 h-5" />
        </button>
        <button
          onClick={onFavorite}
          className="w-9 h-9 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition"
          title="Favorito"
        >
          <img src="/icons/heart-icon.svg" alt="Favorito" className="w-5 h-5" />
        </button>
      </nav>
    </article>
  );
}
