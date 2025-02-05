import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { deleteDoc, doc } from "firebase/firestore"
import { firebase } from "src/firebase/config";

export const removeClient = defineAction({
    accept: 'form',
    input: z.object({
        phoneNumber: z.string()
    }),
    handler: async ({ phoneNumber }, { url }) => {
        try {
            const params = url.searchParams
            const number = params.get('search')
            const isSameNumber = number == phoneNumber

            if (!isSameNumber) {
                return { message: "It was not the same number so I cannot delete it from the client", code: 403 }
            }

            const currentDomicile = firebase.auth.currentUser

            if (!currentDomicile) {
                return { message: "the domicile id null", code: 403 }
            }

            const db = firebase.db
            await deleteDoc(doc(db, "client", phoneNumber))

            return { ok: true, code: 204 }
        } catch (error) {
            const e = JSON.stringify(error)

            console.log(e)
            return { error: e, message: "error deleting client", code: 500 }
        }
    },
})