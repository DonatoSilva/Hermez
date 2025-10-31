import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

const usersURLAPI = `${import.meta.env.URL_LOCAL_BACKEND}${import.meta.env.API_USERS}`;

export const server = {
    getUserData: defineAction({
        input: z.object({
            id: z.string(),
        }),
        handler: async (input) => {
            const response = await fetch(`${usersURLAPI}${input.id}`);
            const { gender: userGender, phone, age } = await response.json();
            const gender = userGender === 'male' ? 'masculino' : 'femenino';
            return { gender, phone, age };
        }
    })
}