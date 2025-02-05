import { defineAction } from "astro:actions";
import { signOut } from "firebase/auth";
import { firebase } from "src/firebase/config";

export const logout = defineAction({
    accept: 'json',
    handler: async (_, { cookies }) => {
        try {
            return await signOut(firebase.auth)
        } catch (error) {
            const e = JSON.stringify(error)
            console.log(error)
            throw new Error(e);
        }
    },
})
