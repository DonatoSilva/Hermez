import React from "react";
import type { FC } from "react";
import MenuIcon from "@header/icons/MenuIcon";
import type { TargetCardProps } from "src/types/setting/TargetProps";

const TargetCard: FC<TargetCardProps> = ({ title, last, expiry, id }) => {
  const onEdit = () => {
    console.log(`edit card ${id}`);
  };

  const onDelete = () => {
    console.log(`delete card ${id}`);
  };

  const onFavorite = () => {
    console.log(`favorite card ${id}`);
  };

  return (
    <article className="w-full max-w-full relative flex items-start justify-between">
      <div className="mx-auto relative w-full max-w-sm rounded-tl-lg rounded-tr-lg bg-gradient-to-r from-black to-gray-500 px-6 pt-6 pb-10 select-none cursor-pointer">
        <div className="flex items-center">
          <span className="w-6 h-6 rounded-full  bg-red-700/80 inline-block" />
          <span className="w-6 h-6 rounded-full -m-2 bg-yellow-400/80 inline-block" />
        </div>
        <p className="mt-2 text-white text-sm">{title}</p>
        <p className="mt-8 text-right text-white text-lg tracking-widest">
          *****************{last}
        </p>
        <p className="text-right text-white text-sm">{expiry}</p>
      </div>

      <div className="flex flex-col items-center gap-3 select-none">
        <button
          onClick={onEdit}
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/10 transition cursor-pointer"
        >
          <img src="/icons/edit-icon.svg" alt="Editar" className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/10 transition cursor-pointer"
        >
          <img src="/icons/trash-icon.svg" alt="Eliminar" className="w-5 h-5" />
        </button>
        <button
          onClick={onFavorite}
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/10 transition cursor-pointer"
        >
          <img src="/icons/heart-icon.svg" alt="Favorito" className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
        <MenuIcon className="w-6 h-6 text-gray-300 cursor-pointer" />
      </div>
    </article>
  );
};

export default TargetCard;
