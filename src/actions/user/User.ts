import { ActionError } from "astro/actions/runtime/shared.js";
import { defineAction } from "astro:actions";
import { API_USERS, URL_LOCAL_BACKEND } from 'astro:env/client';
import { z } from "astro:schema";
import { Address } from "./address/Address";

export const User = {
    get: defineAction({
        input: z.object({
            token: z.string(),
        }),
        handler: async ({ token }) => {
            try {
                const response = await fetch(
                    `${URL_LOCAL_BACKEND}${API_USERS}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new ActionError({
                        message: 'Error al obtener el usuario',
                        code: 'BAD_REQUEST',
                    });
                }
                const users = await response.json();
                const firstUser = users[0];

                const { gender, phone, age } = firstUser;

                return { gender, phone, age };
            } catch (error) {
                if (error instanceof ActionError) {
                    throw error;
                }
                throw new ActionError({
                    message: 'Error inesperado al obtener el usuario desde el action',
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        }
    }),
    update: defineAction({
        input: z.object({
            user: z.object({
                gender: z.string().optional(),
                phone: z.string().optional(),
                age: z.string().optional(),
            }),
        }),
        handler: async ({ user }, { locals }) => {
            const token = await locals.auth().getToken({
                template: "jwt-back-hermez",
            });
            try {
                const response = await fetch(
                    `${URL_LOCAL_BACKEND}${API_USERS}update/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(user),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    const message = Object.values(responseData).join(', ');
                    throw new ActionError({
                        message: message || 'Error al actualizar el usuario',
                        code: 'BAD_REQUEST',
                    });
                }

                return responseData;
            } catch (error) {
                if (error instanceof ActionError) {
                    throw error;
                }
                throw new ActionError({
                    message: 'Error inesperado al actualizar el usuario desde el action',
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        }
    }),
    Address
}