import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";
import { firebase } from "src/firebase/config";

export const loginDomicile = defineAction({
    accept: 'form',
    input: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        remenber: z.boolean().optional()
    }),
    handler: async ({ email, password, remenber }) => {
        if (!email || !password) {
            return { message: "Empty fields ", code: 400 };
        }

        try {
            const domicile = await signInWithEmailAndPassword(firebase.auth, email, password)
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