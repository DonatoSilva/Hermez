import { deepMap } from 'nanostores'

export interface DataKey {
    isOpen: boolean
    acction: string
    metaData: Record<string, unknown>
}

export const statusModal = deepMap({} as Record<string, DataKey>)

export const changeStatusModal = (key: never, status: never) => {
    statusModal.setKey(key as never, status as never)
}

export const getStatusModal = (key: never) => {
    return statusModal.get()[key as never]
}

