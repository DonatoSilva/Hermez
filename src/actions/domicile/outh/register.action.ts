import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { createUserWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { firebase } from 'src/firebase/config';

export const register = defineAction({
  accept: 'form',
  input: z.object({
    names: z.string(),
    surnames: z.string(),
    email: z.string().email(),
    cell: z.string(),
    password: z.string().min(8)
  }),
  handler: async ({ names, surnames, email, cell, password }) => {
    if (!names || !surnames || !cell || !email || !password) {
      return { message: "Empty fields ", code: 400 };
    }

    try {
      await createUserWithEmailAndPassword(firebase.auth, email, password)

      return {
        message: "Registration successful",
        code: 200
      };

    } catch (error) {
      const firebaseError = error as AuthError
      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error("Email already in use");
      }

      console.log(JSON.stringify(error))
    }

  },
})