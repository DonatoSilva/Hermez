import { ActionError, defineAction } from "astro:actions";
import { API_USERS, URL_LOCAL_BACKEND } from 'astro:env/client';
import { z } from "astro:schema";

export const Address = {
    get: defineAction({
        input: z.object({
            token: z.string().nonempty('El token es requerido'),
        }),
        handler: async ({ token }) => {
            try {
                const response = await fetch(
                    `${URL_LOCAL_BACKEND}${API_USERS}/my-addresses/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new ActionError({
                        message: 'Error al obtener la dirección',
                        code: 'BAD_REQUEST',
                    });
                }
                const address = await response.json();
                return address;
            } catch (error) {
                if (error instanceof ActionError) {
                    throw error;
                }
                throw new ActionError({
                    message: 'Error inesperado al obtener la dirección',
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        }
    })
}