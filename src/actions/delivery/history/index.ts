import { ActionError, defineAction } from "astro:actions";
import { API_DELIVERY_REQUESTS, URL_LOCAL_BACKEND } from "astro:env/client";
import { z } from "astro:schema";

export const History =  {
    getHistorys: defineAction({
        input: z.object({
            
        }),
        handler: async (_, { locals }) => {
            const userId = await locals.auth().userId;
            
            if (!userId) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "No se pudo obtener el ID de usuario",
                });
            }
            
            const token = await locals.auth().getToken({
                template: "jwt-back-hermez",
            });
            
            if (!token) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "No se pudo obtener el token de autenticación",
                });
            }

            const response = await fetch(
                `${URL_LOCAL_BACKEND}/${API_DELIVERY_REQUESTS}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "No se pudo obtener el historial",
                });
            }

            const data = await response.json();
            return data;
        }
    }),
    getDeliveryHistory: defineAction({
        input: z.object({
            delivery_id: z.string(),
        }),
        handler: async ({ delivery_id }, { locals }) => {
            const userId = await locals.auth().userId;
            
            if (!userId) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "No se pudo obtener el ID de usuario",
                });
            }
            
            const token = await locals.auth().getToken({
                template: "jwt-back-hermez",
            });
            
            if (!token) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "No se pudo obtener el token de autenticación",
                });
            }

            const response = await fetch(
                `${URL_LOCAL_BACKEND}/${API_DELIVERY_REQUESTS}/${delivery_id}/history/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "No se pudo obtener el historial de la entrega",
                });
            }

            const data = await response.json();
            return data;
        }
    }),
    
}