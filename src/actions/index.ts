import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
    getUserData: defineAction({
        input: z.object({
            id: z.string(),
        }),
        handler: async (input) => {
            const response = await fetch(`http://127.0.0.1:8000/user/api/users/${input.id}`);
            const { gender: userGender, phone, age } = await response.json();
            const gender = userGender === 'male' ? 'masculino' : 'femenino';
            return { gender, phone, age };
        }
    })
}