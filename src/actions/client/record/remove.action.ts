import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { doc, deleteDoc } from "firebase/firestore";
import { firebase } from "src/firebase/config";


export const removeRecord = defineAction({
    accept: 'json',
    input: z.object({

    }),
    handler: async ({ }, context) => {
        try {

        } catch (error) {
            const e = JSON.stringify(error)

            console.log(e)
            return { error: e, message: "error creating client", code: 500 }
        }
    },
})