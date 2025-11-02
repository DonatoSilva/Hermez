import { ActionError } from "astro/actions/runtime/shared.js";
import { defineAction } from "astro:actions";
import { API_USERS, URL_LOCAL_BACKEND } from 'astro:env/client';
import { z } from "astro:schema";
import { createClerkClient } from "@clerk/astro/server";
import { Address } from "./address/Address";

export const User = {
    get: defineAction({
        input: z.object({}),
        handler: async ({ }, { locals }) => {
            try {
                const token = await locals.auth().getToken({
                    template: "jwt-back-hermez",
                });


                if (token === null) {
                    throw new Error("Token not found");
                }


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

                const { emailAddresses, firstName, lastName, imageUrl } = await locals.currentUser() ?? {};

                const { gender, phone, age, } = firstUser;

                return { gender, phone, age, emailAddresses, firstName, lastName, imageUrl };
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
                firstName: z.string().optional(),
                lastName: z.string().optional(),
            }),
        }),
        handler: async ({ user }, { locals }) => {
            const token = await locals.auth().getToken({
                template: "jwt-back-hermez",
            });
            
            try {
                // Separar campos de Clerk de campos del backend
                const { firstName, lastName, ...backendFields } = user;
                
                // Actualizar campos de Clerk si están presentes
                if (firstName !== undefined || lastName !== undefined) {
                    const clerkClient = createClerkClient({
                        secretKey: import.meta.env.CLERK_SECRET_KEY,
                    });
                    
                    const currentUser = await locals.currentUser();
                    if (currentUser?.id) {
                        const updateData: { firstName?: string; lastName?: string } = {};
                        if (firstName !== undefined) updateData.firstName = firstName;
                        if (lastName !== undefined) updateData.lastName = lastName;
                        
                        await clerkClient.users.updateUser(currentUser.id, updateData);
                    }
                }
                
                // Actualizar campos del backend si hay alguno
                if (Object.keys(backendFields).length > 0) {
                    const response = await fetch(
                        `${URL_LOCAL_BACKEND}${API_USERS}update/`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify(backendFields),
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
                }
                
                return { success: true };
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