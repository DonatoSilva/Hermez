import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { doc, setDoc, Timestamp, collection, query, where, getDocs } from "firebase/firestore";
import { firebase } from "src/firebase/config";

export const createClient = defineAction({
    accept: 'form',
    input: z.object({
        phoneNumber: z.string().min(10).max(10),
        displayName: z.string()
    }),
    handler: async ({ phoneNumber, displayName }, context) => {
        try {
            const currentDomicile = firebase.auth.currentUser

            if (!currentDomicile) {
                throw new Error("Domicile null");
            }

            const phoneNumberRegex = /^\d+$/;

            if (!phoneNumberRegex.test(phoneNumber)) {
                throw new Error("Phone number is not valid");
            }

            const clientRef = collection(firebase.db, "clients");

            const q = query(clientRef, where("phoneNumber", "==", phoneNumber));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                return {
                    message: "client already exists",
                    ok: false,
                    code: 400
                }
            }

            await setDoc(doc(clientRef, phoneNumber), {
                phoneNumber: phoneNumber,
                displayName: displayName,
                createDate: Timestamp.fromDate(new Date()),
                domicileID: currentDomicile.uid
            })

            return {
                message: "client created successfully",
                ok: true,
                clientNumber: phoneNumber,
                code: 204
            }
        } catch (error) {
            throw error;
        }
    },

})