import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getDoc, doc, getDocs, collection, orderBy, query } from "firebase/firestore";
import { firebase } from "src/firebase/config";

export const getDeliveries = defineAction({
    accept: 'json',
    input: z.object({
        uid: z.string()
    }),
    handler: async ({ uid }, _) => {
        try {
            const domicileRef = doc(firebase.db, "domiciles", uid);
            const docSnap = await getDoc(domicileRef);

            if (!docSnap.exists()) {
                return {
                    error: true,
                    message: "domicile-not-found",
                    ok: false,
                    code: 404
                }
            }

            const domicileData = docSnap.data();
            const { cell: phoneNumber, names, surnames, paidStatus } = domicileData;

            const deliveriesRef = collection(domicileRef, "deliveries")
            const recods = await getDocs(query(deliveriesRef, orderBy("deliveryDate", "desc")))

            const deliveries = recods.docs.map((doc) => doc.data())

            return {
                domicile: {
                    deliveries,
                    phoneNumber,
                    names,
                    surnames,
                    paidStatus
                },
                ok: true,
                code: 200
            }

        } catch (error) {
            throw error;
        }
    }
})

