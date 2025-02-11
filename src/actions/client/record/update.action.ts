import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const updateRecord = defineAction({
    accept: 'form',
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