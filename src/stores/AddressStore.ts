import { atom, effect } from "nanostores";
import type { AddressItemProps } from "src/types/Address/AddressProps";

export const allAddresses = atom<AddressItemProps[]>([]);
export const favorites = atom<AddressItemProps[]>([]);

export const addressToEdit = atom<AddressItemProps | undefined>(undefined);

/// Effect to update the favorites atom when the allAddresses atom changes
effect(allAddresses, (addresses) => {
    if (!addresses.length) return

    favorites.set(addresses.filter((address) => address.isFavorite));
})
