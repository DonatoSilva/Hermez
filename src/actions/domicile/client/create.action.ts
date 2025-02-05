import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { firebase } from "src/firebase/config";

export const createClient = defineAction({
    accept: 'form',
    input: z.object({
        phoneNumber: z.string(),
        displayName: z.string()
    }),
    handler: async ({ phoneNumber, displayName }, context) => {
        try {
            const currentDomicile = firebase.auth.currentUser

            if (!currentDomicile) {
                throw new Error("Domicile null");
            }

            await setDoc(doc(firebase.db, 'clients', phoneNumber), {
                phoneNumber: phoneNumber,
                displayName: displayName,
                createDate: Timestamp.fromDate(new Date()),
                domicileID: currentDomicile.uid
            })

            return {
                message: "client created successfully",
                OK: true,
                clientNumber: phoneNumber,
                code: 204
            }
        } catch (error) {
            const e = JSON.stringify(error)

            console.log(e)
            return { error: e, message: "error creating client", code: 500 }
        }
    },
})