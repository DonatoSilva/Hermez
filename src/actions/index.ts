import { logIn, logout, register } from "./domicile/outh";
import { createClient, removeClient, getClient } from './client'
import { removeDelivery, getDeliveries } from './domicile/deliverie'
import { createRecord, getRecords } from './client/record'


export const server = {
  domicile: {
    auth: {
      register,
      logIn,
      logout
    },
    deliveries: {
      removeDelivery,
      getDeliveries
    }
  },
  client: {
    createClient,
    removeClient,
    getClient,
    record: {
      createRecord,
      getRecords
    }
  },

}