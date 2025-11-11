import { toJSON } from "@scripts/formDataToJson";
import { ActionError, defineAction } from "astro:actions";
import { API_USERS, URL_LOCAL_BACKEND } from "astro:env/client";

type CreateVehicleBody = {
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color?: string | null;
  type?: string | null;
};

export const Vehicle = {
  get: defineAction({
    accept: "form",
    handler: async (_, context) => {
      const token = await context.locals.auth().getToken({ template: "jwt-back-hermez" });
      if (!token) throw new ActionError({ code: "UNAUTHORIZED", message: "No autenticado, por favor inicie sesión" });

      const res = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/vehicles/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      });
      if (!res.ok) throw new ActionError({ code: "BAD_REQUEST", message: "No se pudieron cargar los vehículos" });
      return await res.json();
    },
  }),

  getVehicleTypes: defineAction({
    accept: "form",
    handler: async (_, context) => {
      const token = await context.locals.auth().getToken({ template: "jwt-back-hermez" });
      if (!token) throw new ActionError({ code: "UNAUTHORIZED", message: "No autenticado" });

      const res = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/vehicle-types/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      });
      if (!res.ok) throw new ActionError({ code: "BAD_REQUEST", message: "No se pudieron cargar los tipos de vehículos" });
      return await res.json();
    },
  }),

  detail: defineAction({
    accept: "form",
    handler: async (fd, context) => {
      const vehicleId = fd.get("vehicleId")?.toString();
      if (!vehicleId) throw new ActionError({ code: "BAD_REQUEST", message: "vehicleId requerido" });

      const { getToken } = await context.locals.auth?.();
      const token = await getToken?.({ template: "jwt-back-hermez" });
      if (!token) throw new ActionError({ code: "UNAUTHORIZED", message: "No autenticado" });

      const res = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/vehicles/${vehicleId}/`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new ActionError({ code: "BAD_REQUEST", message: "No se pudo cargar el vehículo" });
      return (await res.json()) as unknown;
    },
  }),

  create: defineAction({
    accept: "form",
    handler: async (fd, context) => {
      const { locals } = context;
      const body = toJSON(fd) as CreateVehicleBody;
      if (!body?.brand || !body?.model || !body?.year || !body?.licensePlate || !body?.vin) {
        throw new ActionError({ code: "BAD_REQUEST", message: "Campos requeridos faltantes" });
      }

      const token = await locals.auth().getToken({ template: "jwt-back-hermez" });
      if (!token) throw new ActionError({ code: "UNAUTHORIZED", message: "No autenticado" });

      const payload = JSON.stringify(body);

      const res = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/vehicles/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await res.json()

      if (!res.ok) {
        const message = Object.keys(data).map(key => `${key}: ${data[key]}`).join(', ');
        throw new ActionError({ code: "BAD_REQUEST", message: message || "No se pudo crear el vehículo" });
      }

      return data;
    },
  }),

  update: defineAction({
    accept: "form",
    handler: async (fd, context) => {
      const vehicleId = fd.get("vehicleId")?.toString();
      if (!vehicleId) throw new ActionError({ code: "BAD_REQUEST", message: "vehicleId requerido" });

      const body = toJSON(fd) as Partial<CreateVehicleBody>;
      const { getToken } = await context.locals.auth?.();
      const token = await getToken?.({ template: "jwt-back-hermez" });
      if (!token) throw new ActionError({ code: "UNAUTHORIZED", message: "No autenticado" });

      const res = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/vehicles/${vehicleId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new ActionError({ code: "BAD_REQUEST", message: err?.detail || "No se pudo actualizar el vehículo" });
      }
      return (await res.json()) as unknown;
    },
  }),

  delete: defineAction({
    accept: "form",
    handler: async (fd, context) => {
      const vehicleId = fd.get("vehicleId")?.toString();
      if (!vehicleId) throw new ActionError({ code: "BAD_REQUEST", message: "vehicleId requerido" });

      const { getToken } = await context.locals.auth?.();
      const token = await getToken?.({ template: "jwt-back-hermez" });
      if (!token) throw new ActionError({ code: "UNAUTHORIZED", message: "No autenticado" });

      const res = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/vehicles/${vehicleId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new ActionError({ code: "BAD_REQUEST", message: err?.detail || "No se pudo eliminar el vehículo" });
      }
      return { message: "Vehículo eliminado con éxito" };
    },
  }),
};