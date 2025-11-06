import { deepMap } from 'nanostores'

export const statusModal = deepMap({})

export const changeStatusModal = (key: never, status: never) => {
    statusModal.setKey(key as never, status as never)
}

export const getStatusModal = (key: never) => {
    return statusModal.get()[key as never]
}

