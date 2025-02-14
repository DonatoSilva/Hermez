import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { doc, deleteDoc } from "@firebase/firestore";
import { firebase } from "src/firebase/config";


export const removeRecord = defineAction({
    accept: 'json',
    input: z.object({
        recordID: z.string(),
        phoneNumber: z.string()
    }),
    handler: async ({ recordID, phoneNumber }, context) => {
        try {
            const clientRef = doc(firebase.db, 'clients', phoneNumber)
            const recordRef = doc(clientRef, 'records', recordID)

            await deleteDoc(recordRef)

            return { message: "record deleted successfully", ok: true, code: 200 }
        } catch (error) {
            throw error
        }
    },
})