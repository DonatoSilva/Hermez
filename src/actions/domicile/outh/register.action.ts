import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, type AuthError } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
  handler: async ({ names, surnames, email, cell, password }, { url }) => {
    if (!names || !surnames || !cell || !email || !password) {
      return { message: "Empty fields ", code: 400 };
    }

    try {
      const domicileCurrent = await createUserWithEmailAndPassword(firebase.auth, email, password)
      const domicile = domicileCurrent.user

      const name = names.split(" ")[0]
      const lastName = surnames.split(" ")[0]

      const fullName = name + " " + lastName

      updateProfile(domicile, {
        displayName: fullName
      })

      sendEmailVerification(domicileCurrent.user, {
        url: url.origin
      })

      await setDoc(doc(firebase.db, 'domiciles', domicile.uid), {
        names: names,
        surnames: surnames,
        cell: cell
      })

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