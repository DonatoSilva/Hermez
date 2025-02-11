import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { firebase } from "src/firebase/config";


export const removeClient = defineAction({
    accept: 'json',
    input: z.object({
        phoneNumber: z.string()
    }),
    handler: async ({ phoneNumber }, { request }) => {
        try {
            const params = new URL(request.headers.get('referer')!).searchParams
            const number = params.get('search')
            const isSameNumber = number == phoneNumber

            if (phoneNumber.length != 10) {
                return { message: "the phone number must have 10 digits", code: 403 }
            }

            if (!isSameNumber) {
                return { message: "It was not the same number so I cannot delete it from the client", code: 403 }
            }

            const currentDomicile = firebase.auth.currentUser

            if (!currentDomicile) {
                return { message: "the domicile id null", code: 403 }
            }

            const db = firebase.db
            const clientRef = collection(db, "clients")
            const recordsRef = collection(clientRef, phoneNumber, "records")
            const records = await getDocs(recordsRef)

            await deleteDoc(doc(clientRef, phoneNumber))

            const batch = records.docs.map((r) => {
                return deleteDoc(doc(recordsRef, r.id))
            })

            await Promise.all(batch)
            await deleteDoc(doc(clientRef, phoneNumber))

            return { ok: true, message: "client deleted successfully", code: 204 }

        } catch (error) {
            throw error
        }
    },
})