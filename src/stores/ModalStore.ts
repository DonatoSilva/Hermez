import { deepMap } from '@nanostores/deepmap';

export interface DataKey {
    isOpen: boolean;
    action?: string;
    metaData?: {
        title?: string;
        [key: string]: unknown;
    }
}

export const statusModal = deepMap({} as Record<string, DataKey>)

export const changeStatusModal = (key: never, status: never) => {
    statusModal.setKey(key as never, status as never)
}

export const getStatusModal = (key: never) => {
    return statusModal.get()[key as never]
}

