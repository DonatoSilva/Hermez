import { createClerkClient } from "@clerk/astro/server";
import { toJSON } from "@scripts/formDataToJson";
import { ActionError } from "astro/actions/runtime/shared.js";
import { defineAction } from "astro:actions";
import { API_USERS, URL_LOCAL_BACKEND } from 'astro:env/client';
import { z } from "astro:schema";
import { Address } from "./address/Address";
import { Vehicle } from "./vehicle/Vehicle";

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
                    `${URL_LOCAL_BACKEND}/${API_USERS}/me/`, {
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
    register: defineAction({
        accept: 'form',
        handler: async (formData, { locals }) => { 
            try {
                const token = await locals.auth().getToken({
                    template: "jwt-back-hermez",
                });

                if (token === null) {
                    throw new Error("Token not found");
                }

                const payload = toJSON(formData);
                const response = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/update/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new ActionError({
                        message: 'Error al guardar los datos',
                        code: 'BAD_REQUEST',
                    });
                }
                
                const data = await response.json();
                return { success: true, message: data.message };
            } catch (error) {
                if (error instanceof ActionError) {
                    throw error;
                }
                throw new ActionError({
                    message: 'Error inesperado al registrar el usuario',
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
                        `${URL_LOCAL_BACKEND}/${API_USERS}/me/update/`, {
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
    getReviewsUser: defineAction({
        input: z.object({}),
        handler: async ({ }, { locals }) => {
            try {
                const token = await locals.auth().getToken({
                    template: "jwt-back-hermez",
                });

                if (token === null) {
                    throw new ActionError({
                        message: "Token de autenticación no encontrado",
                        code: "UNAUTHORIZED",
                    });
                }

                const response = await fetch(
                    `${URL_LOCAL_BACKEND}/${API_USERS}/me/ratings/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new ActionError({
                        message: errorData.detail || 'Error al obtener las reseñas del usuario',
                        code: 'BAD_REQUEST',
                    });
                }

                const reviews = await response.json();
                return reviews;
            } catch (error) {
                if (error instanceof ActionError) {
                    throw error;
                }
                throw new ActionError({
                    message: 'Error inesperado al obtener las reseñas del usuario',
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        }
    }),
    createRating: defineAction({
        input: z.object({
            ratee_id: z.string().min(1, 'El ID del usuario a calificar es requerido'),
            rating: z.number().int().min(0, 'La calificación mínima es 0').max(10, 'La calificación máxima es 10'),
            comment: z.string().optional(),
        }),
        handler: async ({ ratee_id, rating, comment }, { locals }) => {
            try {
                const token = await locals.auth().getToken({
                    template: "jwt-back-hermez",
                });

                if (token === null) {
                    throw new ActionError({
                        message: "Token de autenticación no encontrado",
                        code: "UNAUTHORIZED",
                    });
                }

                const payload: { ratee_id: string; rating: number; comment?: string } = {
                    ratee_id,
                    rating,
                };

                if (comment && comment.trim() !== '') {
                    payload.comment = comment;
                }

                const response = await fetch(
                    `${URL_LOCAL_BACKEND}/${API_USERS}/user-ratings/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new ActionError({
                        message: errorData.detail || 'Error al crear la calificación',
                        code: 'BAD_REQUEST',
                    });
                }

                const ratingData = await response.json();
                return ratingData;
            } catch (error) {
                if (error instanceof ActionError) {
                    throw error;
                }
                throw new ActionError({
                    message: 'Error inesperado al crear la calificación',
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        }
    }),
    changePassword: defineAction({
        input: z.object({
            oldPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
            password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
            confirmPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
        }),
        handler: async ({ oldPassword, password, confirmPassword }, { locals }) => {
            if (password !== confirmPassword) {
                throw new ActionError({ message: 'Las contraseñas no coinciden', code: 'BAD_REQUEST' });
            }

            const userId = locals.auth()?.userId || '';
            if (!userId) {
                throw new ActionError({ message: 'No se proporcionó un ID de usuario válido', code: 'BAD_REQUEST' });
            }

            const clerkClient = createClerkClient({ secretKey: import.meta.env.CLERK_SECRET_KEY });
            const user = await clerkClient.users.getUser(userId);

            const hasPassword =
                (user as any).passwordEnabled ?? (user as any).password_enabled ?? false;

            // Requerir email verificado para crear primera contraseña
            const primaryEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId);
            const isEmailVerified = primaryEmail?.verification?.status === 'verified';
            if (!hasPassword && !isEmailVerified) {
                throw new ActionError({
                    message: 'Verifica tu email antes de crear una contraseña.',
                    code: 'BAD_REQUEST',
                });
            }

            if (hasPassword) {
                if (!oldPassword) {
                    throw new ActionError({ message: 'Debes ingresar tu contraseña actual.', code: 'BAD_REQUEST' });
                }
                try {
                    await clerkClient.users.verifyPassword({ userId, password: oldPassword });
                } catch {
                    throw new ActionError({ message: 'La contraseña actual es incorrecta.', code: 'BAD_REQUEST' });
                }
            }

            await clerkClient.users.updateUser(userId, { password });

            return {
                success: true,
                message: hasPassword ? 'Contraseña actualizada con éxito' : 'Contraseña creada con éxito',
                code: 'OK',
            };
        }
    }),
    toggleAvailability: defineAction({
        input: z.object({}),
        handler: async ({}, { locals }) => {
            const token = await locals.auth().getToken({
                template: "jwt-back-hermez",
            });

            if (!token) {
                throw new ActionError({
                    message: 'No autenticado',
                    code: 'UNAUTHORIZED',
                });
            }

            try {
                const response = await fetch(
                    `${URL_LOCAL_BACKEND}/${API_USERS}/me/toggle-availability/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new ActionError({
                        message: data.detail || 'Error al cambiar la disponibilidad',
                        code: 'BAD_REQUEST',
                    });
                }

                return { is_available: data.is_available };
            } catch (error) {
                if (error instanceof ActionError) {
                    throw error;
                }
                throw new ActionError({
                    message: 'Error inesperado al cambiar la disponibilidad',
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        }
    }),
    delete: defineAction({
        input: z.object({}),
        handler: async (input, { locals }) => {
            const userId = locals.auth()?.userId || '';
            try {
                if (!userId) {
                    throw new ActionError({
                        message: 'No se proporcionó un ID de usuario válido',
                        code: 'BAD_REQUEST',
                    });
                }

                const clerkClient = createClerkClient({
                    secretKey: import.meta.env.CLERK_SECRET_KEY,
                });
                await clerkClient.users.deleteUser(userId);

                return { success: true, message: 'Usuario eliminado con éxito', code: 'OK' };

            } catch (error) {
                if (error instanceof ActionError) {
                    throw error;
                }
                throw new ActionError({
                    message: 'Error al eliminar el usuario',
                    code: 'INTERNAL_SERVER_ERROR',
                });
            }
        }
    }),
    Address,
    Vehicle,
}