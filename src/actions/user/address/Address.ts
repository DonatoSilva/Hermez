import { toJSON } from "@scripts/formDataToJson";
import { ActionError, defineAction } from "astro:actions";
import { API_USERS, URL_LOCAL_BACKEND } from 'astro:env/client';

export const Address = {
    get: defineAction({
        accept: 'form',
        handler: async (_, ctx) => {
            const { locals } = ctx;
            try {
                const token = await locals.auth().getToken({ template: "jwt-back-hermez" });
                const response = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/addresses/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new ActionError({ message: 'Error al obtener las direcciones', code: 'BAD_REQUEST' });
                }
                return await response.json();
            } catch (error) {
                console.error('Error al obtener las direcciones:', error);
                if (error instanceof ActionError) throw error;
                throw new ActionError({ message: 'Error inesperado al obtener las direcciones', code: 'INTERNAL_SERVER_ERROR' });
            }
        }
    }),

    create: defineAction({
        accept: 'form',
        handler: async (formData, ctx) => {
            const { locals } = ctx;
            try {
                const token = await locals.auth().getToken({ template: "jwt-back-hermez" });
                const payload = toJSON(formData);
                const response = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/addresses/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    throw new ActionError({ message: 'Error al crear la dirección', code: 'BAD_REQUEST' });
                }
                return await response.json();
            } catch (error) {
                console.error('Error al crear la dirección:', error);
                if (error instanceof ActionError) throw error;
                throw new ActionError({ message: 'Error inesperado al crear la dirección', code: 'INTERNAL_SERVER_ERROR' });
            }
        }
    }),

    detail: defineAction({
        accept: 'form',
        handler: async (formData, ctx) => {
            const { locals } = ctx;
            try {
                const addressId = String(formData.get('addressId') ?? '');
                if (!addressId) {
                    throw new ActionError({ message: 'addressId requerido', code: 'BAD_REQUEST' });
                }
                const token = await locals.auth().getToken({ template: "jwt-back-hermez" });
                const response = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/addresses/${addressId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new ActionError({ message: 'Error al obtener la dirección', code: 'BAD_REQUEST' });
                }
                return await response.json();
            } catch (error) {
                console.error('Error al obtener la dirección:', error);
                if (error instanceof ActionError) throw error;
                throw new ActionError({ message: 'Error inesperado al obtener la dirección', code: 'INTERNAL_SERVER_ERROR' });
            }
        }
    }),

    update: defineAction({
        accept: 'form',
        handler: async (formData, ctx) => {
            const { locals } = ctx;
            try {
                const addressId = String(formData.get('addressId') ?? '');
                if (!addressId) {
                    throw new ActionError({ message: 'addressId requerido', code: 'BAD_REQUEST' });
                }
                const token = await locals.auth().getToken({ template: "jwt-back-hermez" });
                const payload = toJSON(formData);
                delete payload.addressId;
                const response = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/addresses/${addressId}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    throw new ActionError({ message: 'Error al actualizar la dirección', code: 'BAD_REQUEST' });
                }
                return await response.json();
            } catch (error) {
                console.error('Error al actualizar la dirección:', error);
                if (error instanceof ActionError) throw error;
                throw new ActionError({ message: 'Error inesperado al actualizar la dirección', code: 'INTERNAL_SERVER_ERROR' });
            }
        }
    }),

    delete: defineAction({
        accept: 'form',
        handler: async (formData, ctx) => {
            const { locals } = ctx;
            try {
                const addressId = String(formData.get('addressId') ?? '');
                if (!addressId) {
                    throw new ActionError({ message: 'addressId requerido', code: 'BAD_REQUEST' });
                }
                const token = await locals.auth().getToken({ template: "jwt-back-hermez" });
                const response = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/addresses/${addressId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new ActionError({ message: 'Error al eliminar la dirección', code: 'BAD_REQUEST' });
                }
                return { ok: true };
            } catch (error) {
                console.error('Error al eliminar la dirección:', error);
                if (error instanceof ActionError) throw error;
                throw new ActionError({ message: 'Error inesperado al eliminar la dirección', code: 'INTERNAL_SERVER_ERROR' });
            }
        }
    }),

    favorite: defineAction({
        accept: 'form',
        handler: async (formData, ctx) => {
            const { locals } = ctx;
            try {
                const addressId = String(formData.get('addressId') ?? '');
                if (!addressId) {
                    throw new ActionError({ message: 'addressId requerido', code: 'BAD_REQUEST' });
                }
                const token = await locals.auth().getToken({ template: "jwt-back-hermez" });
                const response = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/addresses/${addressId}/add-favorite/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new ActionError({ message: 'Error al marcar favorita', code: 'BAD_REQUEST' });
                }
                return await response.json();
            } catch (error) {
                console.error('Error al marcar favorita:', error);
                if (error instanceof ActionError) throw error;
                throw new ActionError({ message: 'Error inesperado al marcar favorita', code: 'INTERNAL_SERVER_ERROR' });
            }
        }
    }),
};