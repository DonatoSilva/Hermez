import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { doc, addDoc, collection, Timestamp, setDoc } from "@firebase/firestore";
import { firebase } from "src/firebase/config";
import { convertDate } from "src/scritps/convertDate";



export const createRecord = defineAction({
    accept: 'json',
    input: z.object({
        deliveryDate: z.string(),
        deliveryPrice: z.number(),
        paidStatus: z.boolean(),
        phoneNumber: z.string()
    }),
    handler: async ({ deliveryDate, deliveryPrice, paidStatus, phoneNumber }, { locals }) => {
        try {

            const currentDomicile = locals.domicile
            if (!currentDomicile) {
                throw new ActionError({
                    message: "Domicile must be logged in to create a record",
                    code: "UNAUTHORIZED"
                })
            }

            const paidStatusValue = paidStatus ? 'paid' : 'pending';

            const clientRef = doc(firebase.db, 'clients', phoneNumber)
            let subCollectionRef = collection(clientRef, 'records')

            const recordRef = await addDoc(subCollectionRef, {
                deliveryDate: Timestamp.fromDate(new Date(deliveryDate)),
                deliveryPrice: deliveryPrice,
                paidStatus: paidStatusValue,
                domicileID: currentDomicile.uid
            })


            const recordID = recordRef.id

            const domicileRef = doc(firebase.db, 'domiciles', currentDomicile.uid)
            subCollectionRef = collection(domicileRef, 'deliveries')

            await setDoc(doc(subCollectionRef, recordID), {
                recordID: recordID,
                deliveryDate: Timestamp.fromDate(new Date(deliveryDate)),
                deliveryPrice: deliveryPrice,
                paidStatus: paidStatusValue,
                clientNumber: phoneNumber
            })

            return { message: "record created successfully", ok: true, code: 204 }
        } catch (error) {
            throw new ActionError({
                message: "Error creating record",
                code: "INTERNAL_SERVER_ERROR"
            })
        }
    },

})