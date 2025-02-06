import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { collection, doc, setDoc } from "firebase/firestore";
import { firebase } from "src/firebase/config";

export const addDelivery = defineAction({
    accept: 'json',
    input: z.object({

        recordID: z.string(),
        deliveryDate: z.string(),
        deliveryPrice: z.number(),
        paidStatus: z.enum(['pending', 'paid']),
        domicileID: z.string(),
        clientNumber: z.string(),
    }),
    handler: async ({ recordID, deliveryDate, deliveryPrice, paidStatus, domicileID, clientNumber }) => {

        try {
            const currentDomicile = firebase.auth.currentUser

            if (!currentDomicile) return { message: "domicile is null", code: 403 }
            if (currentDomicile.uid !== domicileID) return { message: "domicile is not authorized", code: 403 }

            const domicileRef = doc(firebase.db, 'domiciles', domicileID)
            const subCollectionRef = collection(domicileRef, 'deliveries')

            await setDoc(doc(subCollectionRef, recordID), {
                recordID: recordID,
                deliveryDate: deliveryDate,
                deliveryPrice: deliveryPrice,
                paidStatus: paidStatus,
                clientNumber: clientNumber
            })

            return { message: "record created successfully", code: 204 }
        } catch (error) {

            const e = JSON.stringify(error)


            console.log(e)
            return { error: e, message: "error creating record", code: 500 }
        }
    },
})