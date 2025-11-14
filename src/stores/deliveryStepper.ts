import { atom, computed, map } from "nanostores"

export const totalSteps = 3
export const currentStep = atom<number>(1)

export const deliveryData = map<{
  origin: string
  destination: string
  vehicleType: "moto" | "carro" | "mototaxi"
  deliveryType: "alimento" | "persona" | "documentos" | "paquete"
  notes: string
  paymentMethod: "efectivo" | "tarjeta"
  price: number
}>({
  origin: "",
  destination: "",
  vehicleType: "moto",
  deliveryType: "documentos",
  notes: "",
  paymentMethod: "efectivo",
  price: 4000
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
}