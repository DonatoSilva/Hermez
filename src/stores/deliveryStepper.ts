import { atom, computed, map } from "nanostores"
import type { QuoteProps } from "src/types/Delivery/DeliveryProps"


export const totalSteps = 3
export const currentStep = atom<number>(1)

export const totalOffers = atom<number>(0)

export const titleStep = computed(currentStep, (s) => {
  switch (s) {
    case 1:
      return "Origen y destino"
    case 2:
      return "Tipo de vehículo y tipo de entrega"
    case 3:
      return "Resumen y confirmación"
  }
})

export const deliveryData = map<QuoteProps>({
  pickup_address: "",
  delivery_address: "",
  vehicle_type: {
    id: null,
    value: "",
  },
  category: "",
  description: "",
  payment_method: null,
  client_price: 4000,
  observations: [],
  estimated_weight: null,
  estimated_size: null
})

export const progressLabel = computed(currentStep, (s) => `${s}/${totalSteps}`)

export const nextStep = () => {
  const i = currentStep.get()
  if (i < totalSteps) currentStep.set(i + 1)
}

export const prevStep = () => {
  const i = currentStep.get()
  if (i > 1) currentStep.set(i - 1)
}

export const resetStepper = () => {
  currentStep.set(1)
  deliveryData.set({
    pickup_address: "",
    delivery_address: "",
    vehicle_type: {
      id: null,
      value: "",
    },
    category: "",
    description: "",
    payment_method: null,
    client_price: 4000,
    observations: [],
    estimated_weight: null,
    estimated_size: null
  })
}