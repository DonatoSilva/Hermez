import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { collection, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { firebase } from "src/firebase/config";

export const updateRecord = defineAction({
    accept: 'json',
    input: z.object({
        recordID: z.string(),
        phoneNumber: z.string(),
        deliveryDate: z.string().optional(),
        deliveryPrice: z.number().optional(),
        paidStatus: z.boolean().optional(),
    }),
    handler: async ({ recordID, phoneNumber, deliveryDate, deliveryPrice, paidStatus }, context) => {
        try {
            const currentDomicile = context.locals.domicile

            if (!currentDomicile) {
                throw new ActionError({
                    message: "Domicile must be logged in to update a record",
                    code: "UNAUTHORIZED"
                })
            }

            const clientRef = doc(firebase.db, 'clients', phoneNumber)
            let subCollectionRef = collection(clientRef, 'records')

            const dataToUpdate: any = {}

            if (deliveryDate) {
                dataToUpdate.deliveryDate = Timestamp.fromDate(new Date(deliveryDate))
            }

            if (deliveryPrice) {
                dataToUpdate.deliveryPrice = deliveryPrice
            }

            if (paidStatus) {
                dataToUpdate.paidStatus = paidStatus ? 'paid' : 'pending'
            }

            await updateDoc(doc(subCollectionRef, recordID), dataToUpdate)

            return {
                message: "Record updated successfully",
                code: 204,
                dataToUpdate: JSON.stringify({
                    deliveryDate: deliveryDate ?? '',
                    deliveryPrice: deliveryPrice ?? '',
                    paidStatus: paidStatus ? 'paid' : 'pending'
                })
            }
        } catch (error) {
            throw error
        }
    },
})