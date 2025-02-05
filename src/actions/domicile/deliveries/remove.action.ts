import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { collection } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { firebase } from "src/firebase/config";

export const removeDelivery = defineAction({
    accept: 'json',
    input: z.object({
        recordID: z.string()
    }),
    handler: async ({ recordID }) => {
        try {
            const currentDomicile = firebase.auth.currentUser

            if (!currentDomicile) return { message: "domicile is null", code: 403 }

            const domicileRef = doc(firebase.db, 'domiciles', currentDomicile.uid)
            const subCollectionRef = collection(domicileRef, 'deliveries')

            await deleteDoc(doc(subCollectionRef, recordID))

            return { message: "delivery deleted successfully", code: 204 }
        } catch (error) {
            const e = JSON.stringify(error)

            console.log(e)
            return { error: e, message: "error deleting delivery", code: 500 }
        }
    },
})
