import { toJSON } from "@scripts/formDataToJson";
import { ActionError, defineAction } from "astro:actions";
import { API_DELIVERY_REQUESTS, URL_LOCAL_BACKEND } from "astro:env/client";
import { z } from "astro:schema";
import { History } from "./history";

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
    addOfferByQuote: defineAction({
        accept: 'form',
        handler: async (formData, ctx) => {
            const { locals } = ctx;
            try {

                const token = await locals.auth().getToken({
                    template: "jwt-back-hermez",
                });

                if (!token) {
                    throw new ActionError({
                        code: "UNAUTHORIZED",
                        message: "No se pudo obtener el token de autenticación",
                    });
                }

                const userId = await locals.auth().userId;

                if (!userId) {
                    throw new ActionError({
                        code: "UNAUTHORIZED",
                        message: "No se pudo obtener el ID de usuario",
                    });
                }

                const payload = toJSON(formData);
                if (payload.proposed_price <= 0) {
                    throw new ActionError({
                        code: "BAD_REQUEST",
                        message: "El precio propuesto debe ser un número positivo",
                    });
                }

                const response = await fetch(
                    `${URL_LOCAL_BACKEND}/${API_DELIVERY_REQUESTS}/quotes/${payload.quote_id}/offers/`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            delivery_person_id: userId,
                            ...payload
                        }),
                    });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error response:", errorData);
                    throw new ActionError({
                        code: "BAD_REQUEST",
                        message: errorData.detail || "No se pudo agregar la oferta",
                    });
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error al agregar la oferta:', error);
                if (error instanceof ActionError) throw error;
                throw new ActionError({ message: 'Error inesperado al agregar la oferta', code: 'INTERNAL_SERVER_ERROR' });
            }
        }
    }),
    rejectOffer: defineAction({
        input: z.object({
            offerId: z.string().uuid(),
        }),
        handler: async ({ offerId }, { locals }) => {
            try {
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
                    `${URL_LOCAL_BACKEND}/${API_DELIVERY_REQUESTS}/offers/${offerId}/reject/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error response:", errorData);
                    throw new ActionError({
                        code: "BAD_REQUEST",
                        message: errorData.detail || "No se pudo rechazar la oferta",
                    });
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error al rechazar la oferta:', error);
                if (error instanceof ActionError) throw error;
                throw new ActionError({ message: 'Error inesperado al rechazar la oferta', code: 'INTERNAL_SERVER_ERROR' });
            }
        }
    }),

    getDeliveryTypes: defineAction({
        input: z.object({}),
        handler: async (input, { locals }) => {
            try {
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
            } catch (error) {
                console.error('Error al obtener los tipos de domicilio:', error);
                if (error instanceof ActionError) throw error;
                throw new ActionError({ message: 'Error inesperado al obtener los tipos de domicilio', code: 'INTERNAL_SERVER_ERROR' });
            }
        }
    }),
    aceptOffert: defineAction({
        input: z.object({
            offerId: z.string().uuid(),
        }),
        handler: async ({ offerId }, { locals }) => {
            try {
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
                    `${URL_LOCAL_BACKEND}/${API_DELIVERY_REQUESTS}/offers/${offerId}/accept/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new ActionError({
                        code: "BAD_REQUEST",
                        message: "No se pudo aceptar la oferta",
                    });
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error al aceptar la oferta:', error);
                if (error instanceof ActionError) throw error;
                throw new ActionError({ message: 'Error inesperado al aceptar la oferta', code: 'INTERNAL_SERVER_ERROR' });
            }
        }
    }),
    updateDeliveryStatus: defineAction({
        accept: 'form',
        handler: async (formData, { locals }) => {
            try {
                const token = await locals.auth().getToken({
                    template: "jwt-back-hermez",
                });

                if (!token) {
                    throw new ActionError({
                        code: "UNAUTHORIZED",
                        message: "No se pudo obtener el token de autenticación",
                    });
                }

                const deliveryId = formData.get('deliveryId') as string;
                const status = formData.get('status') as string;

                if (!deliveryId || !status) {
                    throw new ActionError({
                        code: "BAD_REQUEST",
                        message: "ID de entrega y estado son requeridos",
                    });
                }

                const response = await fetch(
                    `${URL_LOCAL_BACKEND}/${API_DELIVERY_REQUESTS}/deliveries/${deliveryId}/status/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error response:", errorData);
                    throw new ActionError({
                        code: "BAD_REQUEST",
                        message: errorData.detail || "No se pudo actualizar el estado de la entrega",
                    });
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error al actualizar estado de entrega:', error);
                if (error instanceof ActionError) throw error;
                throw new ActionError({ message: 'Error inesperado al actualizar el estado', code: 'INTERNAL_SERVER_ERROR' });
            }
        }
    }),
    cancelDelivery: defineAction({
        input: z.object({
            deliveryId: z.string().uuid(),
        }),
        handler: async ({ deliveryId }, { locals }) => {
            try {
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
                    `${URL_LOCAL_BACKEND}/${API_DELIVERY_REQUESTS}/deliveries/${deliveryId}/cancel/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error response:", errorData);
                    
                    throw new ActionError({
                        code: response.status === 404 ? "NOT_FOUND" : "BAD_REQUEST",
                        message: errorData.error || errorData.detail || "No se pudo cancelar el domicilio",
                    });
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error al cancelar domicilio:', error);
                if (error instanceof ActionError) throw error;
                throw new ActionError({ 
                    message: 'Error inesperado al cancelar el domicilio', 
                    code: 'INTERNAL_SERVER_ERROR' 
                });
            }
        }
    }),
    History
}
