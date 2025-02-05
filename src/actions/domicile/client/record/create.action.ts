import { actions, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { doc, addDoc, setDoc, collection } from "firebase/firestore";
import { firebase } from "src/firebase/config";


export const createRecord = defineAction({
    accept: 'form',
    input: z.object({
        deliveryDate: z.string(),
        deliveryPrice: z.number(),
        paidStatus: z.enum(['pending', 'paid']),
        clientNumber: z.string()
    }),
    handler: async ({ deliveryDate, deliveryPrice, paidStatus, clientNumber }) => {
        try {
            const currentDomicile = firebase.auth.currentUser

            if (!currentDomicile) return { message: "domicile is null", code: 403 }

            const clientRef = doc(firebase.db, 'clients', clientNumber)
            const subCollectionRef = collection(clientRef, 'records')

            const recordRef = await addDoc(subCollectionRef, {
                deliveryDate: deliveryDate,
                deliveryPrice: deliveryPrice,
                paidStatus: paidStatus,
                domicileID: currentDomicile.uid
            })

            const recordID = recordRef.id

            await actions.domicile.deliveries.addDelivery({
                recordID: recordID,
                deliveryDate: deliveryDate,
                deliveryPrice: deliveryPrice,
                paidStatus: paidStatus,
                domicileID: currentDomicile.uid,
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