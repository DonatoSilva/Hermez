import { ActionError, defineAction } from "astro:actions";
import { API_DELIVERY_REQUESTS, URL_LOCAL_BACKEND } from "astro:env/client";
import { z } from "astro:schema";

export const Delivery = {
    addQuote: defineAction({
        input: z.object({
            category: z.string().uuid(),
            client_price: z.number().positive(),
            payment_method: z.enum(['efectivo', 'nequi']),
            pickup_address: z.string().optional().nullable().default(""),
            delivery_address: z.string().optional().nullable().default(""),
            description: z.string().optional().nullable().default(""),
            observations: z.array(z.string()).optional().default([]),
            vehicle_type: z.string().uuid().optional().nullable().default(null),
            estimated_weight: z.number().positive().optional().nullable().default(null),
            estimated_size: z.string().optional().nullable().default(null)
        }),
        handler: async (input, { locals }) => {
            const { category, client_price, payment_method, pickup_address, delivery_address, description, observations, vehicle_type, estimated_weight, estimated_size } = input;

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
                `${URL_LOCAL_BACKEND}/${API_DELIVERY_REQUESTS}/quotes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    client_id: userId,
                    category_id: category,
                    client_price,
                    payment_method,
                    pickup_address,
                    delivery_address,
                    description,
                    observations,
                    vehicle_type_id: vehicle_type,
                    estimated_weight,
                    estimated_size
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response:", errorData);

                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: errorData.detail || "No se pudo agregar la cotización",
                });
            }

            const data = await response.json();
            return data;
        }
    }),
    getQuoteById: defineAction({
        input: z.object({
            quoteId: z.string().uuid(),
        }),
        handler: async ({ quoteId }, { locals }) => {

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
                `${URL_LOCAL_BACKEND}/${API_DELIVERY_REQUESTS}/quotes/${quoteId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null; // Cotización no encontrada
                }

                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "No se pudo obtener la cotización",
                });
            }

            const data = await response.json();
            return data;
        }
    }),
    cancelQuote: defineAction({
        input: z.object({
            quoteId: z.string().uuid(),
        }),
        handler: async ({ quoteId }, { locals }) => {
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
                `${URL_LOCAL_BACKEND}/${API_DELIVERY_REQUESTS}/quotes/${quoteId}/cancel/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "No se pudo cancelar la cotización",
                });
            }
            const data = await response.json();
            return data;
        }
    }),
    getDeliveryTypes: defineAction({
        input: z.object({}),
        handler: async (input, { locals }) => {
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
                `${URL_LOCAL_BACKEND}/${API_DELIVERY_REQUESTS}/categories/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "No se pudo obtener los tipos de domicilio",
                });
            }

            const data = await response.json();
            return data;
        }
    }),
}
