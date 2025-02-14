import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { firebase } from "./../../firebase/config";

export const getClient = defineAction({
    accept: 'json',
    input: z.object({
        searchValue: z.string()
    }),
    handler: async ({ searchValue }, _) => {
        try {
            const clientRef = collection(firebase.db, "clients");
            const q = query(clientRef, where("phoneNumber", "==", searchValue));
            const snapshot = await getDocs(q);


            if (snapshot.empty) {
                return {
                    message: "client not found",
                    ok: false,
                    code: 404
                }
            }

            const clientData = snapshot.docs[0].data();

            return {
                client: clientData,
                ok: true,
                code: 200
            }
        } catch (error) {
            throw error
        }
    }
})