import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword, type AuthError } from "firebase/auth";
import { firebase } from "src/firebase/config";

export const logIn = defineAction({
    accept: 'form',
    input: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        remenber: z.boolean().optional()
    }),
    handler: async ({ email, password, remenber }, { cookies }) => {
        if (remenber) {
            cookies.set('email', email, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                path: '/',
            })
        } else {
            cookies.delete('email', {
                path: '/',
            })
        }

        if (!email || !password) {
            return { message: "Empty fields ", code: 400 };
        }

        try {
            const domicile = await setPersistence(firebase.auth, browserLocalPersistence).then(() => {
                return signInWithEmailAndPassword(firebase.auth, email, password)
            })
            return JSON.stringify(domicile)
        } catch (error) {
            const firebaseError = error as AuthError

            if (firebaseError.code === 'auth/user-not-found') {
                throw new Error("User not found");
            }

            if (firebaseError.code === 'auth/wrong-passwor') {
                throw new Error("wrong password");
            }


            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    },
})