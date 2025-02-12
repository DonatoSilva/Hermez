import { ActionError, defineAction } from "astro:actions";
import { record, z } from "astro:schema";
import { collection, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { firebase } from "src/firebase/config";

export const getRecords = defineAction({
    accept: 'json',
    input: z.object({
        phoneNumber: z.string()
    }),
    handler: async ({ phoneNumber }, { locals, request }) => {
        try {
            // if same phone number
            const params = new URL(request.url).searchParams
            const number = params.get('search')

            const isSameNumber = number == phoneNumber

            if (phoneNumber.length != 10) {
                throw new ActionError({
                    message: "the phone number must have 10 digits",
                    code: "BAD_REQUEST"
                })
            }


            if (!isSameNumber) {
                throw new ActionError({
                    message: "not the same number, cannot get records",
                    code: "BAD_REQUEST"
                })
            }

            const clientRef = doc(firebase.db, 'clients', phoneNumber)
            let subCollectionRef = collection(clientRef, 'records')

            const records = await getDocs(query(subCollectionRef, orderBy('deliveryDate', 'desc')))


            if (records.empty) {
                return {
                    records: [],
                    ok: true,
                    code: 200
                }
            }

            const domicileRef = collection(firebase.db, 'domiciles')
            const domicile = await getDocs(domicileRef)

            const namesDomiciles: any = {}

            const recordsData: any[] = records.docs.map((doc) => {
                let fullName = ""

                if (namesDomiciles[doc.data().domicileUid]) {
                    fullName = namesDomiciles[doc.data().domicileUid]
                } else {
                    const name = domicile.docs.find((domicile: any) => domicile.uid == doc.data().domicileUid)?.data().names.split(" ")[0]
                    const surname = domicile.docs.find((domicile: any) => domicile.uid == doc.data().domicileUid)?.data().surnames.split(" ")[0]

                    fullName = name + " " + surname
                    namesDomiciles[doc.data().domicileUid] = fullName
                }

                return {
                    domicileID: doc.data().domicileID,
                    deliveryPrice: doc.data().deliveryPrice,
                    deliveryDate: doc.data().deliveryDate,
                    paidStatus: doc.data().paidStatus,
                    fullName: fullName
                }

            })

            return { records: recordsData, ok: true, code: 200 }
        } catch (error) {
            throw error
        }
    },
})


export const getRecord = defineAction({
    accept: 'form',
    input: z.object({
    }),
    handler: async ({ }, context) => {
        try {

        } catch (error) {
            throw error
        }
    },
})